import {
  Box,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  Typography,
  useTheme,
} from '@material-ui/core';
import SettingsIcon from '@material-ui/icons/Settings';
import React, { useContext } from 'react';

import { MediaSettingsContext } from '../../../MediaSettingsProvider';
import * as S from './MediaSettingsPopover.styles';

export default function MediaSettingsPopover() {
  const theme = useTheme();

  const [
    settingsMenuAnchorEl,
    setSettingsMenuAnchorEl,
  ] = React.useState<HTMLButtonElement | null>(null);

  const handleOpenSettingsMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
  ) => {
    setSettingsMenuAnchorEl(event.currentTarget);
  };

  const handleCloseSettingsMenu = () => {
    setSettingsMenuAnchorEl(null);
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
      <IconButton
        onClick={handleOpenSettingsMenu}
        aria-label="open-settings-modal"
      >
        <SettingsIcon />
      </IconButton>

      <Popover
        open={!!settingsMenuAnchorEl}
        anchorEl={settingsMenuAnchorEl}
        onClose={handleCloseSettingsMenu}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <S.SettingsPopover p={theme.spacing(0.5)}>
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
        </S.SettingsPopover>
      </Popover>
    </>
  );
}
