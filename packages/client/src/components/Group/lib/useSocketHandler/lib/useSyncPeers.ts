import { useEffect, useRef } from 'react';

const SYNC_INTERVAL = 5000;

export default function useSyncPeers({
  groupId,
  socket,
}: {
  groupId: string;
  socket: SocketIOClient.Socket;
}) {
  const interval = useRef(0);

  useEffect(() => {
    const getUsers = () =>
      socket.emit('syncUsers', {
        fromId: socket.id,
        roomId: groupId,
      });

    interval.current = window.setInterval(getUsers, SYNC_INTERVAL);

    return function cleanup() {
      window.clearInterval(interval.current);
    };
  }, [groupId, socket]);
}
