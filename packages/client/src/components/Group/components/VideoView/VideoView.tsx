import { Box, Fab, IconButton, useTheme } from '@material-ui/core';
import CallEndIcon from '@material-ui/icons/CallEnd';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import React from 'react';

import useIdleTimer from '../../../../lib/hooks/useIdleTImer';
import Activities from '../Activities';
import MediaSettingsPopover from '../MediaSettingsPopover';
import * as S from './VideoView.styles';

export interface StreamsDict {
  [key: string]: { user: { name: string; id: string }; stream?: MediaStream };
}

interface Props {
  activeViewId: string;
  children: ({ streams }: { streams: StreamsDict }) => React.ReactNode;
  isAdmin: boolean;
  isCameraOff: boolean;
  isMuted: boolean;
  isSharingScreen: boolean;
  onHangup: () => void;
  setActiveViewId: (id: string) => void;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  toggleIsSharingScreen: () => void;
}

export default function VideoView(props: Props) {
  const theme = useTheme();
  const { isIdle } = useIdleTimer({ wait: 3500 });

  return (
    <S.VideoView
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      {props.isAdmin && (
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
      )}
      <Box height="100%">{props.children({ streams: props.streams })}</Box>
      <S.Controls isIdle={isIdle}>
        <S.ActionWrapper>
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
        </S.ActionWrapper>
        <S.ActionWrapper>
          <IconButton onClick={props.toggleIsMuted} aria-label="mute">
            {props.isMuted ? <MicOffIcon /> : <MicIcon />}
          </IconButton>

          <Box display="inline-block" mx={theme.spacing(0.2)}>
            <Fab
              onClick={props.onHangup}
              aria-label="hang-up"
              color="secondary"
            >
              <CallEndIcon />
            </Fab>
          </Box>

          <IconButton onClick={props.toggleCamera} aria-label="toggle-camera">
            {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
          </IconButton>
        </S.ActionWrapper>
        <S.ActionWrapper>
          <MediaSettingsPopover />
        </S.ActionWrapper>
      </S.Controls>
    </S.VideoView>
  );
}
