import { useCallback, useState } from 'react';

interface ExperimentalMediaDevices extends MediaDevices {
  getDisplayMedia: (options: Record<string, unknown>) => Promise<MediaStream>;
}

const DISPLAY_OPTIONS = {
  video: {
    cursor: 'always',
  },
  audio: {
    sampleRate: 44100,
  },
};

async function startCapture() {
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

interface Props {
  onStreamStarted: () => void;
  onStreamEnded: () => void;
}

export default function useScreenShare({
  onStreamStarted,
  onStreamEnded,
}: Props) {
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [screenShareStream, setScreenShareStream] = useState<MediaStream>();

  const startScreenShare = async () => {
    setIsSharingScreen(true);
    const stream = await startCapture();

    // User hit cancel, or screen share errored
    if (!stream) {
      setIsSharingScreen(false);
      onStreamEnded();
      return;
    }

    if (stream) {
      setScreenShareStream(stream);
      onStreamStarted();
    }

    const videoTrack = stream?.getVideoTracks()[0];

    // Handle ending screen share natively
    videoTrack?.addEventListener('ended', () => {
      setIsSharingScreen(false);
      setScreenShareStream(undefined);
      onStreamEnded();
    });
  };

  const stopScreenShare = useCallback(() => {
    stopCapture(screenShareStream);
    setIsSharingScreen(false);
    setScreenShareStream(undefined);
    onStreamEnded();
  }, [screenShareStream, onStreamEnded]);

  return {
    startScreenShare,
    stopScreenShare,
    screenShareStream,
    isSharingScreen,
  };
}
