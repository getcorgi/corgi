import { useContext, useEffect, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';

const stopStream = (localStream?: MediaStream) => {
  localStream?.getTracks().forEach(track => {
    track.stop();
  });
};

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { mediaConstraints } = useContext(MediaSettingsContext);

  useEffect(() => {
    (async () => {
      // No input devices available
      if (localStream || (!mediaConstraints.audio && !mediaConstraints.video))
        return;

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints,
        );
        setLocalStream(stream);
      } catch (e) {
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
  };
}
