import { Box, IconButton } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import React from 'react';

import Activities from '../Activities';
import * as S from './VideoView.styles';

export interface StreamsDict {
  [key: string]: { user: { name: string; id: string }; stream?: MediaStream };
}

interface Props {
  onHangup: () => void;
  isCameraOff: boolean;
  isMuted: boolean;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  children: ({ streams }: { streams: StreamsDict }) => React.ReactNode;
  activeViewId: string;
  setActiveViewId: (id: string) => void;
}

export default function VideoView(props: Props) {
  const theme = useTheme();

  return (
    <Box
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Box
        display="flex"
        justifyContent="center"
        position="absolute"
        width="100%"
      >
        <Activities
          setActiveViewId={props.setActiveViewId}
          activeViewId={props.activeViewId}
        />
      </Box>
      <Box height="100%">{props.children({ streams: props.streams })}</Box>
      <S.Controls>
        <Box>
          <IconButton
            onClick={props.onHangup}
            aria-label="hang-up"
            color="primary"
          >
            <CallEndIcon />
          </IconButton>

          <IconButton
            onClick={props.toggleIsMuted}
            aria-label="mute"
            color="primary"
          >
            {props.isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>

          <IconButton
            onClick={props.toggleCamera}
            aria-label="toggle-camera"
            color="primary"
          >
            {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </Box>
      </S.Controls>
    </Box>
  );
}
