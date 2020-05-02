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

interface Props {
  children: React.ReactNode;
}

interface MediaSettingsContextValues {
  activeDevices: ActiveDevices;
  availableDevices: AvailableDevices;
  handleClosePermissionAlert: () => void;
  isPermissonAlertOpen: boolean;
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
  handleClosePermissionAlert: noop,
  isPermissonAlertOpen: false,
  mediaConstraints: DEFAULT_MEDIA_CONSTRAINTS,
  setActiveDevices: noop,
});

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

  const [isPermissonAlertOpen, setIsPermissonAlertOpen] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const micPermissions = await navigator.permissions.query({
          name: 'microphone',
        });
        const cameraPermissions = await navigator.permissions.query({
          name: 'camera',
        });
        const isMissingPermissions =
          (!micPermissions && !cameraPermissions) ||
          (micPermissions?.state === 'denied' &&
            cameraPermissions?.state === 'denied');

        if (isMissingPermissions) {
          setIsPermissonAlertOpen(true);
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (!areAvailableDevicesLoaded) {
        const devices: {
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

        devices.videoInput = devices.videoInput.filter(
          device => device.deviceId,
        );

        devices.audioInput = devices.audioInput.filter(
          device => device.deviceId,
        );

        devices.audioOutput = devices.audioOutput.filter(
          device => device.deviceId,
        );

        if (
          devices.videoInput.length === 0 &&
          devices.audioInput.length === 0 &&
          !isPermissonAlertOpen
        ) {
          setIsPermissonAlertOpen(true);
        }

        if (devices.videoInput.length === 0) {
          devices.videoInput.push({
            label: 'No video devices available',
          } as MediaDeviceInfo);
        }

        if (devices.audioInput.length === 0) {
          devices.audioInput.push({
            label: 'No audio input devices available',
          } as MediaDeviceInfo);
        }

        if (devices.audioOutput.length === 0) {
          devices.audioOutput.push({
            label: 'No audio output devices available',
          } as MediaDeviceInfo);
        }

        setAvailableDevices(devices);
        setAreAvailableDevicesLoaded(true);
      }
    })();
  }, [availableDevices, areAvailableDevicesLoaded, isPermissonAlertOpen]);

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
                  echoCancellation: true,
                  noiseSuppression: true,
                },
              }
            : {}),
          ...(activeDevices.videoInput
            ? {
                video: {
                  deviceId: {
                    exact: activeDevices.videoInput,
                  },
                  aspectRatio: 1.777777,
                },
              }
            : {}),
        });
      })();
    }
  }, [activeDevices]);

  const handleClosePermissionAlert = () => {
    setIsPermissonAlertOpen(false);
  };

  const value = {
    activeDevices,
    availableDevices,
    setActiveDevices,
    mediaConstraints,
    isPermissonAlertOpen,
    handleClosePermissionAlert,
  };

  return (
    <MediaSettingsContext.Provider value={value}>
      {props.children}
    </MediaSettingsContext.Provider>
  );
}
