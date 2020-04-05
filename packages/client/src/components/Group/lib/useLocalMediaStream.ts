import { useEffect, useRef, useState } from 'react';

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [currentAudioDevice, setCurrentAudioDevice] = useState<string>();
  const [currentVideoDevice, setCurrentVideoDevice] = useState<string>();
  const videoDevices = useRef<MediaDeviceInfo[]>([]);
  const audioDevices = useRef<MediaDeviceInfo[]>([]);

  const defaultConstraints = {
    video: true,
    audio: true,
  };

  useEffect(() => {
    (async () => {
      await (await navigator.mediaDevices.enumerateDevices()).forEach(
        device => {
          if (device.kind === 'audioinput') {
            audioDevices.current.push(device);
          }
          if (device.kind === 'videoinput') {
            videoDevices.current.push(device);
          }
        },
      );
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const constraints = {
        ...defaultConstraints,
        video: {
          deviceId: {
            exact: currentVideoDevice,
          },
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      setLocalStream(stream);
    })();
  }, [currentVideoDevice]);

  return {
    currentVideoDevice,
    currentAudioDevice,
    localStream,
    setCurrentVideoDevice,
    setCurrentAudioDevice,
    audioDevices: audioDevices.current,
    videoDevices: videoDevices.current,
  };
}
