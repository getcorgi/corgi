import { Box } from '@material-ui/core';
import React, { useState } from 'react';

import useIdleTimer from '../../../../lib/hooks/useIdleTImer';
import { User } from '../../lib/useSocketHandler';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
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
  messages: Message[];
  sendMessage: (msg: string) => void;
}

export default function VideoView(props: Props) {
  const { isIdle } = useIdleTimer({ wait: 3500 });
  const [newChatMessage, setNewChatMessage] = useState('');

  const submitChatMessage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    console.log(e);
    props.sendMessage(newChatMessage);
    setNewChatMessage('');
  };

  const onChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(e.target.value);
  };

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
      <div>
        {props.messages.map(({ message }) => {
          return <div>{message}</div>;
        })}

        <div>
          <form onSubmit={submitChatMessage}>
            <input value={newChatMessage} onChange={onChatMessageChange} />
          </form>
        </div>
      </div>

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
