import { useEffect, useState } from 'react';

export default function useToggleCamera(localStream?: MediaStream) {
  const [isCameraOff, setIsCameraOff] = useState(false);

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  useEffect(() => {
    const track = localStream?.getVideoTracks()[0];
    if (!track) return;

    if (isCameraOff) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isCameraOff, localStream]);

  return { isCameraOff, toggleCamera };
}
