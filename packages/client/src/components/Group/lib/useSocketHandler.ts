import { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import useSound from 'use-sound';
import { PlayFunction } from 'use-sound/dist/types';

import { appConfig } from '../../../constants';

type SetStreamsState = React.Dispatch<
  React.SetStateAction<{
    [key: string]: {
      userId: string;
      stream: MediaStream;
    };
  }>
>;

type Connections = Map<string, { peer: Peer.Instance; userData: User }>;

export interface User {
  avatarUrl?: string;
  id?: string;
  isMuted?: boolean;
  isCameraOff?: boolean;
  name: string;
}

function onPeerCreated({
  peerId,
  peer,
  setStreams,
  connections,
}: {
  peerId: string;
  peer: Peer.Instance;
  setStreams: SetStreamsState;
  connections: Connections;
}) {
  peer.on('connect', function() {
    console.log('connected');
  });

  peer.on('error', function(err) {
    console.log('error', err);
  });

  peer.on('stream', function(stream: MediaStream) {
    const isMuted = connections.get(peerId)?.userData?.isMuted;
    const isCameraOff = connections.get(peerId)?.userData?.isCameraOff;

    setStreams(prevStreams => {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });

      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOff;
      });

      return {
        ...prevStreams,
        [peerId]: { userId: peerId, stream },
      };
    });
  });

  peer.on('close', function() {
    setStreams(prevStreams => {
      const newStreams = { ...prevStreams };
      delete newStreams[peerId];

      return newStreams;
    });
  });

  peer.on('data', function(data: string) {
    const { message, id } = JSON.parse(data) as {
      message: { isMuted: boolean; isCameraOff: boolean };
      id: string;
    };

    return setStreams(prevStreams => {
      const newStream = prevStreams[id]?.stream;

      if (!newStream) return prevStreams;

      newStream.getAudioTracks().forEach(track => {
        track.enabled = !message.isMuted;
      });
      newStream.getVideoTracks().forEach(track => {
        track.enabled = !message.isCameraOff;
      });

      return {
        ...prevStreams,
        [id]: { ...prevStreams[id], stream: newStream },
      };
    });
  });
}

function initializeSocketHandler({
  connections,
  groupId,
  localStream,
  playUserJoinedBloop,
  playUserLeftBloop,
  setStreams,
  socket,
  myUserData,
}: {
  connections: Connections;
  groupId: string;
  localStream?: MediaStream;
  playUserJoinedBloop: PlayFunction;
  playUserLeftBloop: PlayFunction;
  setStreams: SetStreamsState;
  socket: SocketIOClient.Socket;
  myUserData: User;
}) {
  socket.emit('userJoinedCall', {
    groupId,
    userData: myUserData,
    socketId: socket.id,
  });

  socket.on('gotSignal', (data: { from: string; signal: string }) => {
    const connection = connections.get(data.from);

    connection?.peer.signal(data.signal);
  });

  // When you join a new room and say hi to everyone
  socket.on('ack', (data: { ack: boolean; userData: User; from: string }) => {
    if (data.ack && localStream !== undefined) {
      const peer = new Peer({
        initiator: true,
        stream: localStream || undefined,
      });

      connections.set(data.from, { peer, userData: data.userData });

      peer.on('signal', function(signalData) {
        socket.emit('sendSignal', {
          to: data.from,
          signal: signalData,
        });
      });
      onPeerCreated({ peerId: data.from, peer, setStreams, connections });
    }
  });

  // When a new user joins a room you are already in
  socket.on('userJoined', (data: { socketId: string; userData: User }) => {
    const clientId = data.socketId;

    if (connections.has(clientId) || clientId === socket.id) {
      return;
    }

    playUserJoinedBloop({});

    const peer = new Peer({ stream: localStream });

    peer.on('signal', (data: any) => {
      socket.emit('sendSignal', {
        to: clientId,
        signal: data,
      });
    });

    onPeerCreated({ peerId: clientId, peer, setStreams, connections });

    socket.emit('ack', { to: clientId, from: socket.id, userData: myUserData });

    connections.set(clientId, { peer, userData: data.userData });
  });

  socket.on('userDisconnected', ({ socketId }: { socketId: string }) => {
    const connection = connections.get(socketId);
    if (connection?.peer) {
      playUserLeftBloop({});
      connection?.peer?.destroy();

      connections.delete(socketId);
    }
  });
}

export default function useSocketHandler({
  localStream,
  groupId,
  isMuted,
  isCameraOff,
}: {
  groupId: string;
  localStream?: MediaStream;
  isMuted: boolean;
  isCameraOff: boolean;
}) {
  const socket = useRef(io(appConfig.socketServer));
  const connections = useRef<Connections>(new Map([]));
  const [users, setUsers] = useState<User[]>([]);
  const [streams, setStreams] = useState<{
    [key: string]: { userId: string; stream: MediaStream };
  }>({});

  const [
    playUserJoinedBloop,
  ] = useSound(`${process.env.PUBLIC_URL}/joinBloop.mp3`, { volume: 0.25 });

  const [
    playUserLeftBloop,
  ] = useSound(`${process.env.PUBLIC_URL}/leaveBloop.mp3`, { volume: 0.25 });

  const [isConnected, setIsConnected] = useState(false);
  const localStreamRef = useRef(localStream);

  const connect = (userData: Omit<User, 'id'>) => {
    initializeSocketHandler({
      connections: connections.current,
      groupId,
      localStream,
      playUserJoinedBloop,
      playUserLeftBloop,
      setStreams,
      socket: socket.current,
      myUserData: userData,
    });
    setIsConnected(true);
    playUserJoinedBloop({});
  };

  const disconnect = useCallback(() => {
    if (!isConnected) return;

    socket.current.emit('userIsDisconnecting', {
      socketId: socket.current.id,
    });
    connections.current.forEach(({ peer }) => peer.destroy());
    playUserLeftBloop({});
    setIsConnected(false);
  }, [playUserLeftBloop, isConnected]);

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
    if (isConnected && localStream !== localStreamRef.current) {
      connections.current.forEach(({ peer }) => {
        if (localStreamRef.current && localStream) {
          peer.removeStream(localStreamRef.current);
          peer.addStream(localStream);
        }
      });

      localStreamRef.current = localStream;
    }
  }, [localStream, isConnected]);

  useEffect(() => {
    if (!socket.current.id) return;

    socket.current.emit('userIsStaging', { roomId: groupId });

    socket.current.emit('getUsers', {
      from: socket.current.id,
      roomId: groupId,
    });

    socket.current.on('gotUsers', ({ users }: { users: User[] }) => {
      setUsers(users.filter(Boolean));
    });
  }, [groupId, socket.current.id]);

  useEffect(() => {
    return function onUnmount() {
      disconnect();
    };
  }, [disconnect]);

  const enhancedStreams = users.reduce((acc, user) => {
    if (!user.id) return acc;

    const stream = streams?.[user?.id]?.stream;

    if (!stream) return acc;

    return {
      ...acc,
      [user?.id]: {
        stream,
        user,
      },
    };
  }, {});

  return {
    connect,
    disconnect,
    isConnected,
    users,
    streams: enhancedStreams,
  };
}
