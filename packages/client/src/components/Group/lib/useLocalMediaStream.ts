import { useCallback, useEffect, useState } from 'react';

const DEFAULT_CONSTRAINTS = {
  video: true,
  audio: true,
};

export default function useMediaStream() {
  const [isLocalStreamLoading, setIsLocalStreamLoading] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [currentAudioDevice, setCurrentAudioDevice] = useState<string>();
  const [currentVideoDevice, setCurrentVideoDevice] = useState<string>();
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const stopStream = useCallback(() => {
    localStream?.getTracks().forEach(track => track.stop());
  }, [localStream]);

  useEffect(() => {
    (async () => {
      await (await navigator.mediaDevices.enumerateDevices()).forEach(
        device => {
          if (device.kind === 'audioinput') {
            setAudioDevices(audioDevices => {
              return [...audioDevices, device];
            });
          }
          if (device.kind === 'videoinput') {
            setVideoDevices(videooDevices => {
              return [...videooDevices, device];
            });
          }
        },
      );
    })();
  }, []);

  useEffect(() => {
    if (!currentVideoDevice && videoDevices[0]) {
      setCurrentVideoDevice(videoDevices[0].deviceId);
    }

    (async () => {
      const constraints = {
        ...DEFAULT_CONSTRAINTS,
        video: {
          deviceId: {
            exact: currentVideoDevice,
          },
        },
      };

      if (localStream || isLocalStreamLoading) return;

      setIsLocalStreamLoading(true);
      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setLocalStream(stream);
      setIsLocalStreamLoading(false);
    })();

    return function onUnmount() {
      stopStream();
    };
  }, [currentVideoDevice, videoDevices, localStream, stopStream, isLocalStreamLoading]);

  return {
    currentVideoDevice,
    currentAudioDevice,
    localStream,
    setCurrentVideoDevice,
    setCurrentAudioDevice,
    audioDevices: audioDevices,
    videoDevices: videoDevices,
  };
}
