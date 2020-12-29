export interface User {
  avatarUrl?: string;
  id?: string;
  isMuted: boolean;
  isCameraOff: boolean;
  name?: string;
}

export interface ExtendedSocket extends SocketIO.Socket {
  userData: User;
}
