import { ExtendedSocket } from './index';

export function handleUserIsInPreview(socket: Pick<ExtendedSocket, 'join'>) {
  return function onUserIsInPreview(data: { roomId: string }) {
    socket.join(data.roomId);
  };
}
