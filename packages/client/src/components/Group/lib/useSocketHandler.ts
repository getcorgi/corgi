import { useEffect, useRef, useState } from 'react';
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

export interface User {
  name: string;
  id: string;
  avatarUrl: string;
}

function onPeerCreated({
  peerId,
  peer,
  setStreams,
}: {
  peerId: string;
  peer: Peer.Instance;
  setStreams: SetStreamsState;
}) {
  peer.on('connect', function() {
    console.log('connected');
  });

  peer.on('error', function(err) {
    console.log('error', err);
  });

  peer.on('stream', function(stream) {
    setStreams(prevStreams => {
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
}

function initializeSocketHandler({
  connections,
  groupId,
  localStream,
  playUserJoinedBloop,
  playUserLeftBloop,
  setStreams,
  socket,
  userData,
}: {
  connections: Map<string, Peer.Instance>;
  groupId: string;
  localStream?: MediaStream;
  playUserJoinedBloop: PlayFunction;
  playUserLeftBloop: PlayFunction;
  setStreams: SetStreamsState;
  socket: SocketIOClient.Socket;
  userData: { name: string };
}) {
  socket.emit('userJoinedCall', {
    groupId,
    userData,
    socketId: socket.id,
  });

  socket.on('gotSignal', (data: any) => {
    connections.get(data.from)?.signal(data.signal);
  });

  socket.on('ack', (data: any) => {
    if (data.ack && localStream !== undefined) {
      const peer = new Peer({
        initiator: true,
        stream: localStream || undefined,
      });
      connections.set(data.from, peer);

      peer.on('signal', function(signalData) {
        socket.emit('sendSignal', {
          to: data.from,
          signal: signalData,
        });
      });
      onPeerCreated({ peerId: data.from, peer, setStreams });
    }
  });

  socket.on('userJoined', (data: { socketId: string }) => {
    const clientId = data.socketId;

    if (connections.has(clientId) || clientId === socket.id) {
      return;
    }

    playUserJoinedBloop({});

    const connection = new Peer({ stream: localStream });

    connection.on('signal', (data: any) => {
      socket.emit('sendSignal', {
        to: clientId,
        signal: data,
      });
    });

    onPeerCreated({ peerId: clientId, peer: connection, setStreams });

    socket.emit('ack', { to: clientId, from: socket.id });

    connections.set(clientId, connection);
  });

  socket.on('userDisconnected', ({ socketId }: { socketId: string }) => {
    const peer = connections.get(socketId);
    if (peer) {
      playUserLeftBloop({});
      peer?.destroy();

      connections.delete(socketId);
    }
  });
}

export default function useSocketHandler({
  localStream,
  groupId,
}: {
  groupId: string;
  localStream?: MediaStream;
}) {
  const socket = useRef(io(appConfig.socketServer));
  const connections = useRef<Map<string, Peer.Instance>>(new Map([]));
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

  useEffect(() => {
    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, []);

  useEffect(() => {
    if (isConnected && localStream !== localStreamRef.current) {
      connections.current.forEach(peer => {
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

  const connect = (userData: { name: string }) => {
    initializeSocketHandler({
      connections: connections.current,
      groupId,
      localStream,
      playUserJoinedBloop,
      playUserLeftBloop,
      setStreams,
      socket: socket.current,
      userData,
    });
    setIsConnected(true);
    playUserJoinedBloop({});
  };

  const disconnect = () => {
    connections.current.forEach(connection => connection.destroy());
    socket.current.emit('userIsDisconnecting', {
      socketId: socket.current.id,
    });
    setIsConnected(false);
    playUserLeftBloop({});
  };

  useEffect(() => {
    return function onUnmount() {
      disconnect();
    };
  }, []);

  const enhancedStreams = users.reduce((acc, user) => {
    const stream = streams?.[user?.id]?.stream;

    if (!stream) return acc;

    return {
      ...acc,
      [user.id]: {
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
