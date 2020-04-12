import React, { useEffect, useState } from 'react';

import { noop } from '../../constants';

const DEFAULT_MEDIA_CONSTRAINTS = {
  video: false,
  audio: false,
};
interface ActiveDevices {
  audioInput?: string;
  audioOutput?: string;
  videoInput?: string;
}
interface AvailableDevices {
  audioInput: MediaDeviceInfo[];
  audioOutput: MediaDeviceInfo[];
  videoInput: MediaDeviceInfo[];
}

interface MediaSettingsContextValues {
  activeDevices: ActiveDevices;
  availableDevices: AvailableDevices;
  mediaConstraints: MediaStreamConstraints;
  setActiveDevices: React.Dispatch<React.SetStateAction<ActiveDevices>>;
}

const DEFAULT_AVAILABLE_DEVICES = {
  audioInput: [],
  audioOutput: [],
  videoInput: [],
};

const DEFAULT_ACTIVE_DEVICES = {
  audioInput: undefined,
  audioOutput: undefined,
  videoInput: undefined,
};

export const MediaSettingsContext = React.createContext<
  MediaSettingsContextValues
>({
  activeDevices: DEFAULT_ACTIVE_DEVICES,
  availableDevices: DEFAULT_AVAILABLE_DEVICES,
  mediaConstraints: DEFAULT_MEDIA_CONSTRAINTS,
  setActiveDevices: noop,
});

interface Props {
  children: React.ReactNode;
}

export function MediaSettingsProvider(props: Props) {
  const [availableDevices, setAvailableDevices] = useState<AvailableDevices>(
    DEFAULT_AVAILABLE_DEVICES,
  );
  const [areAvailableDevicesLoaded, setAreAvailableDevicesLoaded] = useState(
    false,
  );
  const [activeDevices, setActiveDevices] = useState<ActiveDevices>(
    DEFAULT_ACTIVE_DEVICES,
  );
  const [areActiveDevicesSet, setAreActiveDevicesSet] = useState(false);
  const [mediaConstraints, setMediaConstraints] = useState<
    MediaStreamConstraints
  >(DEFAULT_MEDIA_CONSTRAINTS);

  useEffect(() => {
    (async () => {
      if (!areAvailableDevicesLoaded) {
        let devices: {
          audioInput: MediaDeviceInfo[];
          audioOutput: MediaDeviceInfo[];
          videoInput: MediaDeviceInfo[];
        } = DEFAULT_AVAILABLE_DEVICES;
        (await navigator.mediaDevices.enumerateDevices()).forEach(device => {
          if (devices) {
            if (device.kind === 'audioinput') {
              devices.audioInput.push(device);
            }
            if (device.kind === 'videoinput') {
              devices.videoInput.push(device);
            }
            if (device.kind === 'audiooutput') {
              devices.audioOutput.push(device);
            }
          }
        });

        setAvailableDevices(devices);
        setAreAvailableDevicesLoaded(true);
      }
    })();
  }, [availableDevices, areAvailableDevicesLoaded]);

  useEffect(() => {
    if (!areActiveDevicesSet && areAvailableDevicesLoaded) {
      setActiveDevices(
        Object.entries(availableDevices).reduce((acc, [key, value]) => {
          return {
            ...acc,
            [key]: value[0]?.deviceId,
          };
        }, DEFAULT_ACTIVE_DEVICES),
      );
      setAreActiveDevicesSet(true);
    }
  }, [
    activeDevices,
    availableDevices,
    areActiveDevicesSet,
    areAvailableDevicesLoaded,
  ]);

  useEffect(() => {
    if (activeDevices) {
      (async () => {
        setMediaConstraints({
          ...DEFAULT_MEDIA_CONSTRAINTS,
          ...(activeDevices.audioInput
            ? {
                audio: {
                  deviceId: {
                    exact: activeDevices.audioInput,
                  },
                },
              }
            : {}),
          ...(activeDevices.videoInput
            ? {
                video: {
                  deviceId: {
                    exact: activeDevices.videoInput,
                  },
                },
              }
            : {}),
        });
      })();
    }
  }, [activeDevices]);

  const value = {
    activeDevices,
    availableDevices,
    setActiveDevices,
    mediaConstraints,
  };

  return (
    <MediaSettingsContext.Provider value={value}>
      {props.children}
    </MediaSettingsContext.Provider>
  );
}
