import { useEffect, useRef, useState } from 'react';

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

export default function useScreenShare({
  localStream,
  setLocalStream,
}: {
  localStream?: MediaStream;
  setLocalStream: React.Dispatch<React.SetStateAction<MediaStream | undefined>>;
}) {
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [hasSetScreenShare, setHasSetScreenShare] = useState(false);

  const toggleIsSharingScreen = () => {
    setIsSharingScreen(!isSharingScreen);
  };

  useEffect(() => {
    (async () => {
      console.log({ isSharingScreen, hasSetScreenShare });
      if (isSharingScreen && !hasSetScreenShare) {
        const clonedStream = localStream?.clone();
        const stream = await startCapture();

        // User hit cancel, or screen share errored
        if (!stream) {
          setHasSetScreenShare(false);
          setIsSharingScreen(false);
          return;
        }

        const videoTrack = stream?.getVideoTracks()[0];

        videoTrack?.addEventListener('ended', () => {
          console.log('eyyyy yooooo');
          setLocalStream(clonedStream);
          setHasSetScreenShare(false);
          setIsSharingScreen(false);
        });

        if (stream) {
          setLocalStream(stream);
          setHasSetScreenShare(true);
        }
      }
    })();
  }, [isSharingScreen, hasSetScreenShare, setLocalStream, localStream]);

  return {
    isSharingScreen,
    toggleIsSharingScreen,
  };
}
