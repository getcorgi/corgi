import React, { useEffect, useState } from 'react';

import { noop } from '../../constants';

interface MediaSettingsContextValues {
  audioInputDevices: MediaDeviceInfo[];
  audioOutputDevices: MediaDeviceInfo[];
  currentAudioInputDevice?: string;
  currentAudioOutputDevice?: string;
  currentVideoDevice?: string;
  setCurrentAudioInputDevice: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setCurrentAudioOutputDevice: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  setCurrentVideoDevice: React.Dispatch<
    React.SetStateAction<string | undefined>
  >;
  videoDevices: MediaDeviceInfo[];
  mediaConstraints: MediaStreamConstraints;
}

const DEFAULT_MEDIA_CONSTRAINTS = {
  video: true,
  audio: true,
};

export const MediaSettingsContext = React.createContext<
  MediaSettingsContextValues
>({
  audioInputDevices: [],
  audioOutputDevices: [],
  currentAudioInputDevice: '',
  currentAudioOutputDevice: '',
  currentVideoDevice: '',
  setCurrentAudioInputDevice: noop,
  setCurrentAudioOutputDevice: noop,
  setCurrentVideoDevice: noop,
  videoDevices: [],
  mediaConstraints: DEFAULT_MEDIA_CONSTRAINTS,
});

interface Props {
  children: React.ReactNode;
}

export function MediaSettingsProvider(props: Props) {
  const [currentAudioInputDevice, setCurrentAudioInputDevice] = useState<
    string
  >();
  const [currentAudioOutputDevice, setCurrentAudioOutputDevice] = useState<
    string
  >();
  const [currentVideoDevice, setCurrentVideoDevice] = useState<string>();
  const [audioInputDevices, setAudioInputDevices] = useState<MediaDeviceInfo[]>(
    [],
  );
  const [audioOutputDevices, setAudioOutputDevices] = useState<
    MediaDeviceInfo[]
  >([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [mediaConstraints, setMediaConstraints] = useState<
    MediaStreamConstraints
  >(DEFAULT_MEDIA_CONSTRAINTS);

  useEffect(() => {
    (async () => {
      await (await navigator.mediaDevices.enumerateDevices()).forEach(
        device => {
          if (device.kind === 'audioinput') {
            setAudioInputDevices(devices => {
              return [...devices, device];
            });
          }
          if (device.kind === 'videoinput') {
            setVideoDevices(devices => {
              return [...devices, device];
            });
          }
          if (device.kind === 'audiooutput') {
            setAudioOutputDevices(devices => {
              return [...devices, device];
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
    if (!currentAudioInputDevice && audioInputDevices[0]) {
      setCurrentAudioInputDevice(audioInputDevices[0].deviceId);
    }
    if (!currentAudioOutputDevice && audioOutputDevices[0]) {
      setCurrentAudioOutputDevice(audioOutputDevices[0].deviceId);
    }
  }, [
    audioInputDevices,
    audioOutputDevices,
    currentAudioInputDevice,
    currentAudioOutputDevice,
    currentVideoDevice,
    videoDevices,
  ]);

  useEffect(() => {
    setMediaConstraints({
      ...DEFAULT_MEDIA_CONSTRAINTS,
      audio: currentAudioInputDevice
        ? {
            deviceId: { exact: currentAudioInputDevice },
          }
        : true,

      video: currentVideoDevice
        ? {
            deviceId: { exact: currentVideoDevice },
          }
        : true,
    });
  }, [currentAudioInputDevice, currentVideoDevice]);

  const value = {
    audioInputDevices,
    audioOutputDevices,
    currentAudioInputDevice,
    currentAudioOutputDevice,
    currentVideoDevice,
    setCurrentAudioInputDevice,
    setCurrentAudioOutputDevice,
    setCurrentVideoDevice,
    videoDevices,
    mediaConstraints,
  };

  return (
    <MediaSettingsContext.Provider value={value}>
      {props.children}
    </MediaSettingsContext.Provider>
  );
}
