import { Box, Fab, IconButton, Tooltip, useTheme } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import React from 'react';

import { keyLabelMap } from '../../../Hotkeys/Hotkeys';
import * as S from './VideoControls.styles';

interface Props {
  isCameraOff: boolean;
  isMuted: boolean;
  onHangup: () => void;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
}

export default function VideoControls(props: Props) {
  const theme = useTheme();

  return (
    <>
      <div />
      <S.ActionWrapper>
        <Tooltip title={keyLabelMap['MUTE']}>
          <IconButton onClick={props.toggleIsMuted} aria-label="mute">
            {props.isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>

        <Box display="inline-block" mx={theme.spacing(0.2)}>
          <Fab onClick={props.onHangup} aria-label="hang-up" color="secondary">
            <CallEndIcon />
          </Fab>
        </Box>

        <Tooltip title={keyLabelMap['DISABLE_VIDEO']}>
          <IconButton onClick={props.toggleCamera} aria-label="toggle-camera">
            {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </Tooltip>
      </S.ActionWrapper>
      <div />
    </>
  );
}
