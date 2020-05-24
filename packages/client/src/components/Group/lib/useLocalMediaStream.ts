import { useContext, useEffect, useRef, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';
import { muteTrack } from './useMute';

const stopStream = (localStream?: MediaStream) => {
  localStream?.getTracks().forEach(track => {
    track.stop();
  });
};

export enum LocalStreamStatus {
  Unset = 'Unset',
  Loading = 'Loading',
  Set = 'Set',
  Error = 'Error',
}

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [localStreamStatus, setLocalStreamStatus] = useState<LocalStreamStatus>(
    LocalStreamStatus.Unset,
  );
  const { mediaConstraints } = useContext(MediaSettingsContext);
  const mediaConstraintsRef = useRef(mediaConstraints);

  useEffect(() => {
    (async () => {
      // No input devices available
      if (
        (!mediaConstraints.audio && !mediaConstraints.video) ||
        (localStream && mediaConstraintsRef.current === mediaConstraints)
      ) {
        return setLocalStreamStatus(LocalStreamStatus.Unset);
      }

      mediaConstraintsRef.current = mediaConstraints;

      try {
        setLocalStreamStatus(LocalStreamStatus.Loading);
        const stream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints,
        );

        const persistedIsMuted = localStorage.getItem('user:isMuted');
        const isMuted = persistedIsMuted === 'true';

        muteTrack(stream, isMuted);

        setLocalStream(stream);
        setLocalStreamStatus(LocalStreamStatus.Set);
      } catch (e) {
        console.log(e);
        // Handle Error
      }
    })();

    return function onUnmount() {
      if (localStream) {
        stopStream(localStream);
      }
    };
  }, [mediaConstraints, localStream]);

  return {
    localStream,
    localStreamStatus,
    setLocalStream,
  };
}
