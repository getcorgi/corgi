import { ExtendedSocket } from './types';

export function handleUserIsInPreview(socket: Pick<ExtendedSocket, 'join'>) {
  return function onUserIsInPreview(data: { roomId: string }): void {
    socket.join(data.roomId);
  };
}
