import { Box } from '@material-ui/core';
import React from 'react';

import useIdleTimer from '../../../../lib/hooks/useIdleTImer';
import { User } from '../../lib/useSocketHandler';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import { Reaction } from '../BasicView/lib/useReactions';
import Sidebar from '../Sidebar';
import VideoControls from '../VideoControls';
import * as S from './VideoView.styles';

export interface StreamsDict {
  [key: string]: { user: User; stream?: MediaStream; reactions?: Reaction[] };
}

interface Props {
  activeViewId: string;
  children: ({
    streams,
    messages,
  }: {
    streams: StreamsDict;
    messages: Message[];
  }) => React.ReactNode;
  unreadMessageCount: number;
  isAdmin: boolean;
  isCameraOff: boolean;
  isMuted: boolean;
  isSharingScreen: boolean;
  messages: Message[];
  onHangup: () => void;
  sendMessage: (msg: string) => void;
  setActiveViewId: (id: string) => void;
  setUnreadMessageCount: (count: number) => void;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  toggleIsSharingScreen: () => void;
}

export default function VideoView(props: Props) {
  const { isIdle } = useIdleTimer({ wait: 3500 });

  return (
    <Sidebar
      activeViewId={props.activeViewId}
      unreadMessageCount={props.unreadMessageCount}
      isAdmin={props.isAdmin}
      messages={props.messages}
      sendMessage={props.sendMessage}
      setActiveViewId={props.setActiveViewId}
      setUnreadMessageCount={props.setUnreadMessageCount}
    >
      <S.VideoView
        position="relative"
        display="flex"
        flexDirection="column"
        justifyContent="space-between"
        height="100%"
      >
        <Box height="100%">
          {props.children({ streams: props.streams, messages: props.messages })}
        </Box>

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
