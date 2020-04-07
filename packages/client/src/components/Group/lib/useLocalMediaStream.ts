import { useCallback, useContext, useEffect, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { mediaConstraints } = useContext(MediaSettingsContext);

  const stopStream = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
  }, [localStream]);

  useEffect(() => {
    (async () => {
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints,
      );
      setLocalStream(stream);
    })();

    return function onUnmount() {
      stopStream();
    };
  }, [mediaConstraints]);

  return {
    localStream,
  };
}
