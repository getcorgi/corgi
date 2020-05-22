import { useContext, useRef, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';

export default function useToggleCamera(localStream?: MediaStream | null) {
  const [isCameraOff, setIsCameraOff] = useState(false);
  const { mediaConstraints, setMediaConstraints } = useContext(
    MediaSettingsContext,
  );
  const prevMediaConstraints = useRef<MediaStreamConstraints>();

  const toggleCamera = async () => {
    const newIsCameraOff = !isCameraOff;

    if (newIsCameraOff) {
      prevMediaConstraints.current = mediaConstraints;

      const track = localStream?.getVideoTracks()[0];
      if (!track) return;
      track.stop();

      setMediaConstraints({
        ...mediaConstraints,
        video: false,
      });
    } else {
      setMediaConstraints({
        ...prevMediaConstraints.current,
      });
    }

    setIsCameraOff(newIsCameraOff);
  };

  console.log(mediaConstraints);

  return { isCameraOff, toggleCamera };
}
