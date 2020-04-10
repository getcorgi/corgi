import { useState } from 'react';

export default function useMute(localStream?: MediaStream) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleIsMuted = () => {
    const newIsMuted = !isMuted;
    const track = localStream?.getAudioTracks()[0];
    if (!track) return;

    if (newIsMuted) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }

    setIsMuted(newIsMuted);
  };

  return {
    isMuted,
    toggleIsMuted,
  };
}
