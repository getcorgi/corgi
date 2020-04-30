import { useRef, useState, useCallback } from 'react';

interface ExperimentalMediaDevices extends MediaDevices {
  getDisplayMedia: (options: any) => Promise<MediaStream>;
}

const DISPLAY_OPTIONS = {
  video: {
    cursor: 'always',
  },
  audio: {
    echoCancellation: true,
    noiseSuppression: true,
    sampleRate: 44100,
  },
};

async function startCapture(options?: any) {
  let captureStream = null;

  const mediaDevices = navigator.mediaDevices as ExperimentalMediaDevices;

  try {
    captureStream = await mediaDevices?.getDisplayMedia(DISPLAY_OPTIONS);
  } catch (err) {
    return false;
  }
  return captureStream;
}

const stopCapture = (stream?: MediaStream) => {
  stream?.getTracks().forEach(track => {
    track.stop();
  });
};

export default function useScreenShare() {
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [hasSetScreenShare, setHasSetScreenShare] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream>();

  const startScreenShare = async () => {
    setIsSharingScreen(true);
    const stream = await startCapture();

    // User hit cancel, or screen share errored
    if (!stream) {
      setHasSetScreenShare(false);
      setIsSharingScreen(false);
      return;
    }

    if (stream) {
      setScreenShareStream(stream);
      setHasSetScreenShare(true);
    }

    const videoTrack = stream?.getVideoTracks()[0];

    // Handle ending screen share natively
    videoTrack?.addEventListener('ended', () => {
      setIsSharingScreen(false);
      setHasSetScreenShare(false);
      setScreenShareStream(undefined);
    });
  };

  const stopScreenShare = useCallback(() => {
    stopCapture(screenShareStream);

    setIsSharingScreen(false);
    setHasSetScreenShare(false);
    setScreenShareStream(undefined);
  }, [screenShareStream]);

  return {
    startScreenShare,
    stopScreenShare,
    screenShareStream,
    isSharingScreen,
  };
}
