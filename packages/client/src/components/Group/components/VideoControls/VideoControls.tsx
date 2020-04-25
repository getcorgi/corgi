import { Box, Fab, IconButton, Tooltip, useTheme } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import React from 'react';

import * as S from './VideoControls.styles';

interface Props {
  isCameraOff: boolean;
  isMuted: boolean;
  isSharingScreen: boolean;
  onHangup: () => void;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  toggleIsSharingScreen: () => void;
}

export default function VideoControls(props: Props) {
  const theme = useTheme();

  return (
    <>
      <S.ActionWrapper>
        <Tooltip title="Share screen">
          <IconButton
            onClick={props.toggleIsSharingScreen}
            aria-label="share-screen"
          >
            {props.isSharingScreen ? (
              <StopScreenShareIcon />
            ) : (
              <ScreenShareIcon />
            )}
          </IconButton>
        </Tooltip>
      </S.ActionWrapper>
      <S.ActionWrapper>
        <IconButton onClick={props.toggleIsMuted} aria-label="mute">
          {props.isMuted ? <MicOffIcon /> : <MicIcon />}
        </IconButton>

        <Box display="inline-block" mx={theme.spacing(0.2)}>
          <Fab onClick={props.onHangup} aria-label="hang-up" color="secondary">
            <CallEndIcon />
          </Fab>
        </Box>

        <IconButton onClick={props.toggleCamera} aria-label="toggle-camera">
          {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
        </IconButton>
      </S.ActionWrapper>
      <div />
    </>
  );
}
