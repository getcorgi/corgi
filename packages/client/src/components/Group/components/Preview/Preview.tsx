import {
  Avatar,
  Button,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Popover,
  Select,
  TextField,
  Tooltip,
  Typography,
} from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import SettingsIcon from '@material-ui/icons/Settings';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import AvatarGroup from '@material-ui/lab/AvatarGroup';
import React from 'react';

import { User } from '../../lib/useSocketHandler';
import Video from '../Video';
import * as S from './Preview.styles';

interface Props {
  groupName: string;
  isCameraOff: boolean;
  isMuted: boolean;
  onJoin: () => void;
  stream: MediaStream;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  userName: string;
  onUserNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  users: User[];
  onSelectVideoDevice: (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => void;
  videoDevices: MediaDeviceInfo[];
  currentVideoDevice?: string;
}

export default function Preview(props: Props) {
  const theme = useTheme();
  const classes = S.useStyles();

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

  return (
    <>
      <Box
        display="flex"
        alignItems="center"
        height="100%"
        p={[
          theme.spacing(0.5),
          theme.spacing(0.5),
          theme.spacing(0.5),
          theme.spacing(1.5),
        ]}
      >
        <Grid container={true} spacing={10}>
          <Grid item={true} sm={12} md={7}>
            <S.VideoCard elevation={5}>
              <Box width="100%" height="400px">
                <Video
                  key={props.stream.id}
                  srcObject={props.stream}
                  isMuted={true}
                  isMirrored={true}
                />
              </Box>

              <S.Gradient />
              <S.Controls>
                <Box>
                  <IconButton onClick={props.toggleIsMuted} aria-label="mute">
                    {props.isMuted ? <MicOffIcon /> : <MicIcon />}
                  </IconButton>

                  <IconButton
                    onClick={props.toggleCamera}
                    aria-label="toggle-camera"
                  >
                    {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
                  </IconButton>
                </Box>
                <Box>
                  <IconButton
                    onClick={handleOpenSettingsMenu}
                    aria-label="open-settings-modal"
                  >
                    <SettingsIcon />
                  </IconButton>
                </Box>
              </S.Controls>
            </S.VideoCard>
          </Grid>
          <Grid item={true} sm={12} md={5}>
            <Box display="flex" alignItems="center" height="100%">
              <Box
                display="flex"
                justifyContent="center"
                flexDirection="column"
              >
                <Box mb={theme.spacing(0.5)}>
                  <Typography variant="h4">{props.groupName}</Typography>
                </Box>
                <form onSubmit={props.onJoin}>
                  <Box>
                    <Box mb={theme.spacing(0.5)} width="100%">
                      <TextField
                        fullWidth={true}
                        autoFocus={true}
                        label="Whats your name?"
                        onChange={props.onUserNameChange}
                        value={props.userName}
                        variant="outlined"
                      />
                    </Box>

                    <Box mb={theme.spacing(0.2)}>
                      <AvatarGroup max={5}>
                        {props.users.map(user => (
                          <Tooltip title={user.name}>
                            <Avatar
                              className={classes.Avatar}
                              alt={user.name}
                              src="fallback"
                            />
                          </Tooltip>
                        ))}
                      </AvatarGroup>
                    </Box>

                    <Button
                      onClick={props.onJoin}
                      fullWidth={true}
                      variant="contained"
                      color="primary"
                      id="callButton"
                    >
                      Join
                    </Button>
                  </Box>
                </form>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

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
          <S.FormControl variant="outlined">
            <InputLabel id="camera-select">Camera</InputLabel>
            <Select
              labelId="camera-select"
              value={props.currentVideoDevice}
              onChange={props.onSelectVideoDevice}
            >
              {props.videoDevices.map(device => (
                <MenuItem key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </MenuItem>
              ))}
            </Select>
          </S.FormControl>
        </S.SettingsPopover>
      </Popover>
    </>
  );
}
