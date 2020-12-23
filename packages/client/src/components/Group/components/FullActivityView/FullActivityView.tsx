import { Box } from '@material-ui/core';
import useIdleTimer from 'lib/hooks/useIdleTImer';
import { currentUserState } from 'lib/hooks/useUser';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { User } from '../../lib/useSocketHandler';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import { Reaction } from '../BasicView/lib/useReactions';
import VideoControls from '../VideoControls';
import GameBar from './components/GameBar';
import * as S from './FullActivityView.styles';

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
  isCameraOff: boolean;
  isMuted: boolean;
  onHangup: () => void;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  toggleIsSharingScreen: () => void;
  messages: Message[];
  localStream: MediaStream;
}

export default function FullActivityView(props: Props) {
  const { isIdle } = useIdleTimer({ wait: 3500 });

  const [me] = useRecoilState(currentUserState);
  const [hotSeatUserId, setHotSeatUserId] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [users, setUsers] = useState<{
    byId: {
      [key: string]: {
        score: number;
        hasPlayed: boolean;
      };
    };
    allIds: string[];
  }>({ byId: {}, allIds: [] });

  const allStreams = {
    ...props.streams,
    [me.id]: {
      user: me,
      stream: props.localStream,
    },
  };
  function onStart() {
    console.log(allStreams);
    // @ts-ignore
    const streamMap = Object.keys(allStreams).reduce((acc, streamKey) => {
      const stream = allStreams[streamKey];

      return {
        ...acc,
        byId: {
          ...acc.byId,
          [`${stream.user.id}`]: {
            score: 0,
            hasPlayed: false,
          },
        },
        allIds: [...acc.allIds, stream.user.id],
      } as typeof users;
    }, users);

    setUsers(streamMap);

    const idIndex = Math.round(Math.random() * (streamMap.allIds.length - 1));
    setHotSeatUserId(streamMap.allIds[idIndex]);
    setIsPlaying(true);
  }
  console.log(hotSeatUserId);

  const scoreIncrement = 5;
  const handleCorrect = () => {
    setUsers(prevUsers => {
      return {
        ...prevUsers,
        byId: {
          [me.id]: {
            ...prevUsers.byId[me.id],
            score: prevUsers.byId[me.id].score + scoreIncrement,
          },
        },
      };
    });
  };

  return (
    <S.FullActivityView
      position="relative"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="100%"
    >
      <Box height="100%">
        {props.children({ streams: props.streams, messages: props.messages })}
      </Box>
      <GameBar
        onStart={onStart}
        isInHotseat={hotSeatUserId === me.id}
        hotSeatUserId={hotSeatUserId || ''}
        isPlaying={isPlaying}
        users={users}
        handleCorrect={handleCorrect}
      />

      <S.Controls isIdle={isIdle}>
        <VideoControls
          isCameraOff={props.isCameraOff}
          isMuted={props.isMuted}
          onHangup={props.onHangup}
          toggleCamera={props.toggleCamera}
          toggleIsMuted={props.toggleIsMuted}
        />
      </S.Controls>
    </S.FullActivityView>
  );
}
