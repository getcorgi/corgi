import {
  Box,
  Dialog,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import React, { useContext } from 'react';
import { atom, useRecoilState } from 'recoil';

import { MediaSettingsContext } from '../../../MediaSettingsProvider';
import * as S from './MediaSettingsModal.styles';

export const mediaSettingsModalIsOpenState = atom({
  key: 'MediaSettingsModal__isOpen',
  default: false,
});

export default function MediaSettingsModal() {
  const theme = useTheme();

  const [isOpen, setIsOpen] = useRecoilState(mediaSettingsModalIsOpenState);

  const handleCloseSettingsMenu = () => {
    setIsOpen(false);
  };

  const { availableDevices, activeDevices, setActiveDevices } = useContext(
    MediaSettingsContext,
  );

  const onSelectAudioInputDevice = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    setActiveDevices({ audioInput: e.target.value as string });
  };
  const onSelectVideoDevice = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    setActiveDevices({ videoInput: e.target.value as string });
  };
  const onSelectAudioOutputDevice = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    setActiveDevices({ audioOutput: e.target.value as string });
  };

  return (
    <>
      <Dialog open={isOpen} onClose={handleCloseSettingsMenu}>
        <S.MediaSettingsModal p={theme.spacing(0.5)}>
          <Box mb={theme.spacing(0.2)}>
            <Typography variant="h6">Settings</Typography>
          </Box>

          <Box mb={theme.spacing(0.4)}>
            <S.FormControl variant="filled">
              <InputLabel id="camera-select">Camera</InputLabel>
              <Select
                labelId="camera-select"
                value={activeDevices.videoInput}
                onChange={onSelectVideoDevice}
              >
                {availableDevices.videoInput.map((device: MediaDeviceInfo) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </S.FormControl>
          </Box>
          <Box mb={theme.spacing(0.4)}>
            <S.FormControl variant="filled">
              <InputLabel id="audio-input-select">Audio Input</InputLabel>
              <Select
                labelId="audio-input-select"
                value={activeDevices.audioInput}
                onChange={onSelectAudioInputDevice}
              >
                {availableDevices.audioInput.map((device: MediaDeviceInfo) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </S.FormControl>
          </Box>
          <Box>
            <S.FormControl variant="filled">
              <InputLabel id="audio-output-select">Audio Output</InputLabel>
              <Select
                labelId="audio-output-select"
                value={activeDevices.audioOutput}
                onChange={onSelectAudioOutputDevice}
              >
                {availableDevices.audioOutput.map((device: MediaDeviceInfo) => (
                  <MenuItem key={device.deviceId} value={device.deviceId}>
                    {device.label}
                  </MenuItem>
                ))}
              </Select>
            </S.FormControl>
          </Box>
        </S.MediaSettingsModal>
      </Dialog>
    </>
  );
}
