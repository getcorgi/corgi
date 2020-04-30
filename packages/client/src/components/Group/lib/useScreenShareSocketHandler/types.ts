import { Color } from '@material-ui/core';
import Peer from 'simple-peer';

export type Connections = Map<string, { peer: Peer.Instance; userData: User }>;

export interface User {
  avatarUrl?: string;
  color?: Color;
  id?: string;
  isCameraOff?: boolean;
  isMuted?: boolean;
  name: string;
}

export interface Options {
  socket: SocketIOClient.Socket;
  groupId: string;
  myUserData: User;
  connections: Connections;
  localStream?: MediaStream;
  isScreenSharePeerConnected: boolean;
}
