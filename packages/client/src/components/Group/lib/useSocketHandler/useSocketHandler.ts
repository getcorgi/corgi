import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';
import useSound from 'use-sound';

import { appConfig } from '../../../../constants';
import useChatMessages from './lib/useChatMessages';
import useSocketEvents from './lib/useSocketEvents';
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
  const socket = useRef(
    io(appConfig.socketServer, { forceNew: true, multiplex: false }),
  );
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
    groupId,
    localStream,
    playUserJoinedBloop,
    playUserLeftBloop,
    setStreams,
    myUserData: userData,
    connections: connections.current,
    socket: socket.current,
    isInRoom,
  });

  const joinRoom = () => {
    setIsInRoom(true);
    playUserJoinedBloop({});
  };

  const leaveRoom = useCallback(() => {
    socket.current.emit('userIsLeavingRoom', {
      socketId: socket.current.id,
    });

    connections.current = new Map([]);

    playUserLeftBloop({});
    setIsInRoom(false);
  }, [playUserLeftBloop]);

  const disconnect = useCallback(() => {
    leaveRoom();
    socket.current.close();
  }, [leaveRoom]);

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
          id: socket.current.id,
        }),
      );
    });

    socket.current.emit('userUpdated', { isMuted, isCameraOff });
  }, [isMuted, isCameraOff]);

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
    if (!socket.current.id) return;

    socket.current.emit('userIsInPreview', { roomId: groupId });

    socket.current.emit('getUsers', {
      from: socket.current.id,
      roomId: groupId,
    });

    socket.current.on('gotUsers', ({ users }: { users: User[] }) => {
      setUsers(users.filter(Boolean));
    });
  }, [groupId, socket.current.id]);

  const { messages, sendMessage } = useChatMessages({
    socket: socket.current,
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

  return {
    leaveRoom,
    joinRoom,
    isInRoom,
    users,
    streams: enhancedStreams,
    messages,
    sendMessage,
  };
}
