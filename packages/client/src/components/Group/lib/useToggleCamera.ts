import { useState } from 'react';

export default function useToggleCamera(localStream?: MediaStream | null) {
  const [isCameraOff, setIsCameraOff] = useState(false);

  const toggleCamera = () => {
    const newIsCameraOff = !isCameraOff;
    const track = localStream?.getVideoTracks()[0];
    if (!track) return;

    if (newIsCameraOff) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }

    setIsCameraOff(newIsCameraOff);
  };

  return { isCameraOff, toggleCamera };
}
