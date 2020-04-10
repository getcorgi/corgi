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
      const stream = await navigator.mediaDevices.getUserMedia(
        mediaConstraints,
      );
      setLocalStream(stream);
    })();

    return function onUnmount() {
      stopStream(localStream);
    };
  }, [mediaConstraints]); //eslint-disable-line

  return {
    localStream,
  };
}
