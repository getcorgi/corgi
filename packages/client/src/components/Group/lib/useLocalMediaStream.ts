import { useContext, useEffect, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';

const stopStream = (localStream?: MediaStream) => {
  localStream?.getTracks().forEach(track => {
    track.stop();
  });
};

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream | null>();
  const { mediaConstraints } = useContext(MediaSettingsContext);

  useEffect(() => {
    (async () => {
      if (localStream) return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints,
        );
        setLocalStream(stream);
      } catch (e) {
        console.log('No input devices found');
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
  };
}
