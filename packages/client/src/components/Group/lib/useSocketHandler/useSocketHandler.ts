import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import useSound from 'use-sound';

import { SocketContext } from '../SocketContext';
import useChatMessages from './lib/useChatMessages';
import useSocketEvents from './lib/useSocketEvents';
import useSyncPeers from './lib/useSyncPeers';
import { Connections, User } from './types';

export default function useSocketHandler({
  localStream,
  groupId,
  isMuted,
  isCameraOff,
  userData,
}: {
  groupId: string;
  localStream?: MediaStream;
  isMuted: boolean;
  isCameraOff: boolean;
  userData: User;
}) {
  const { socket } = useContext(SocketContext);

  const connections = useRef<Connections>(new Map([]));
  const [users, setUsers] = useState<User[]>([]);
  const [streams, setStreams] = useState<{
    [key: string]: {
      stream: MediaStream;
      userId: string;
    };
  }>({});

  const [
    playUserJoinedBloop,
  ] = useSound(`${process.env.PUBLIC_URL}/joinBloop.mp3`, { volume: 0.25 });

  const [
    playUserLeftBloop,
  ] = useSound(`${process.env.PUBLIC_URL}/leaveBloop.mp3`, { volume: 0.25 });

  const [isInRoom, setIsInRoom] = useState(false);
  const localStreamRef = useRef(localStream);

  useSocketEvents({
    connections: connections.current,
    groupId,
    isInRoom,
    localStream,
    myUserData: userData,
    playUserJoinedBloop,
    playUserLeftBloop,
    setStreams,
    setUsers,
    socket,
  });

  const joinRoom = () => {
    setIsInRoom(true);
    playUserJoinedBloop({});
  };

  const leaveRoom = useCallback(() => {
    socket.emit('userIsLeavingRoom', {
      socketId: socket.id,
    });

    connections.current = new Map([]);

    playUserLeftBloop({});
    setIsInRoom(false);
  }, [playUserLeftBloop, socket]);

  const disconnect = useCallback(() => {
    leaveRoom();
    socket.close();
  }, [leaveRoom, socket]);

  useEffect(() => {
    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, [disconnect]);

  useEffect(() => {
    connections.current.forEach(({ peer }) => {
      if (!peer || !peer.write) return;

      peer.write(
        JSON.stringify({
          message: { isMuted, isCameraOff },
          id: socket.id,
        }),
      );
    });

    socket.emit('userUpdated', { isMuted, isCameraOff });
  }, [isMuted, isCameraOff, socket]);

  useEffect(() => {
    if (isInRoom && localStream !== localStreamRef.current) {
      connections.current.forEach(({ peer }) => {
        if (peer && localStreamRef.current && localStream) {
          peer.removeStream(localStreamRef.current);
          peer.addStream(localStream);
        }
      });

      localStreamRef.current = localStream;
    }
  }, [localStream, isInRoom]);

  useEffect(() => {
    if (!socket.id) return;

    socket.emit('userIsInPreview', { roomId: groupId });

    socket.emit('getUsers', {
      from: socket.id,
      roomId: groupId,
    });
    socket.on('gotUsers', ({ users }: { users: User[] }) => {
      if (!users?.length) return;
      setUsers(users.filter(Boolean));
    });
  }, [groupId, socket, socket.id]);

  const {
    messages,
    sendMessage,
    setUnreadMessageCount,
    unreadMessageCount,
  } = useChatMessages({
    socket: socket,
  });

  useEffect(() => {
    return function onUnmount() {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const enhancedStreams = Object.entries(streams).reduce(
    (acc, [key, streamObj]) => {
      const user = connections.current.get(key)?.userData;

      return {
        ...acc,
        [key]: {
          user,
          stream: streamObj.stream,
        },
      };
    },
    {},
  );

  useSyncPeers({
    groupId,
    socket: socket,
  });

  return {
    isInRoom,
    joinRoom,
    leaveRoom,
    messages,
    sendMessage,
    setUnreadMessageCount,
    streams: enhancedStreams,
    unreadMessageCount,
    users,
  };
}
