import { Box } from '@material-ui/core';
import React from 'react';

import useIdleTimer from '../../../../lib/hooks/useIdleTImer';
import { User } from '../../lib/useSocketHandler';
import Activities from '../Activities';
import VideoControls from '../VideoControls';
import * as S from './VideoView.styles';

export interface StreamsDict {
  [key: string]: { user: User; stream?: MediaStream };
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
        <VideoControls
          isCameraOff={props.isCameraOff}
          isMuted={props.isMuted}
          isSharingScreen={props.isSharingScreen}
          onHangup={props.onHangup}
          toggleCamera={props.toggleCamera}
          toggleIsMuted={props.toggleIsMuted}
          toggleIsSharingScreen={props.toggleIsSharingScreen}
        />
      </S.Controls>
    </S.VideoView>
  );
}
