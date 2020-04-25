import { Box } from '@material-ui/core';
import React from 'react';

import useIdleTimer from '../../../../lib/hooks/useIdleTImer';
import { User } from '../../lib/useSocketHandler';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import Sidebar from '../Sidebar';
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
  messages: Message[];
  sendMessage: (msg: string) => void;
}

export default function VideoView(props: Props) {
  const { isIdle } = useIdleTimer({ wait: 3500 });

  return (
    <Sidebar
      messages={props.messages}
      sendMessage={props.sendMessage}
      setActiveViewId={props.setActiveViewId}
      activeViewId={props.activeViewId}
      isAdmin={props.isAdmin}
    >
      <S.VideoView
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
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
    </Sidebar>
  );
}
