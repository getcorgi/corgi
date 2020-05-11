import { Color } from '@material-ui/core';
import { SetStateAction } from 'react';
import Peer from 'simple-peer';
import { PlayFunction } from 'use-sound/dist/types';

export type Connections = Map<string, { peer: Peer.Instance; userData: User }>;

export interface User {
  avatarUrl?: string;
  color?: Color;
  id?: string;
  isCameraOff?: boolean;
  isMuted?: boolean;
  name: string;
  firebaseAuthId?: string;
}

export interface Options {
  socket: SocketIOClient.Socket;
  groupId: string;
  myUserData: User;
  connections: Connections;
  localStream?: MediaStream;
  playUserJoinedBloop: PlayFunction;
  playUserLeftBloop: PlayFunction;
  setStreams: SetStreamsState;
  setUsers: (value: SetStateAction<User[]>) => void;
  isInRoom: boolean;
}

export type SetStreamsState = React.Dispatch<
  React.SetStateAction<{
    [key: string]: {
      userId: string;
      stream: MediaStream;
    };
  }>
>;
