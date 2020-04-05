import { useEffect, useState } from 'react';

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const [currentAudioDevice, setCurrentAudioDevice] = useState<string>();
  const [currentVideoDevice, setCurrentVideoDevice] = useState<string>();
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);

  const defaultConstraints = {
    video: true,
    audio: true,
  };

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
  }, [currentVideoDevice, videoDevices]);

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
