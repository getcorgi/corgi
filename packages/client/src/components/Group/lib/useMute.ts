import { useEffect, useState } from 'react';

export default function useMute(localStream?: MediaStream) {
  const [isMuted, setIsMuted] = useState(false);

  const toggleIsMuted = () => setIsMuted(!isMuted);

  useEffect(() => {
    const track = localStream?.getAudioTracks()[0];
    if (!track) return;

    if (isMuted) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isMuted, localStream]);

  return {
    isMuted,
    toggleIsMuted,
  };
}
