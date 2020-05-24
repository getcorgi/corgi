import { useState } from 'react';

export const muteTrack = (localStream: MediaStream, isMuted: boolean) => {
  const track = localStream.getAudioTracks()[0];
  if (!track) return;

  if (isMuted) {
    track.enabled = false;
  } else {
    track.enabled = true;
  }
};

export default function useMute(localStream?: MediaStream | null) {
  const persistedIsMuted = localStorage.getItem('user:isMuted');
  const [isMuted, setIsMuted] = useState(persistedIsMuted === 'true');

  const toggleIsMuted = () => {
    if (!localStream) return;
    const newIsMuted = !isMuted;

    muteTrack(localStream, newIsMuted);

    setIsMuted(newIsMuted);

    localStorage.setItem('user:isMuted', `${newIsMuted}`);
  };

  return {
    isMuted,
    toggleIsMuted,
  };
}
