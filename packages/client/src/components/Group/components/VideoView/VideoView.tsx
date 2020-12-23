import { Box } from '@material-ui/core';
import useIdleTimer from 'lib/hooks/useIdleTImer';
import React from 'react';

import { User } from '../../lib/useSocketHandler';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import { Reaction } from '../BasicView/lib/useReactions';
import VideoControls from '../VideoControls';
import * as S from './VideoView.styles';

export interface StreamsDict {
  [key: string]: { user: User; stream?: MediaStream; reactions?: Reaction[] };
}

interface Props {
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
  setUnreadMessageCount: (count: number) => void;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  toggleIsSharingScreen: () => void;
}

export default function VideoView(props: Props) {
  const { isIdle } = useIdleTimer({ wait: 3500 });
  console.log('video view');

  return (
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
          onHangup={props.onHangup}
          toggleCamera={props.toggleCamera}
          toggleIsMuted={props.toggleIsMuted}
        />
      </S.Controls>
    </S.VideoView>
  );
}
