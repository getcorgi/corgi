import { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

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
  socket,
  localStream,
  connections,
  setStreams,
  groupId,
  userData,
}: {
  socket: SocketIOClient.Socket;
  localStream?: MediaStream;
  groupId: string;
  connections: Map<string, Peer.Instance>;
  setStreams: SetStreamsState;
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
    if (data.ack && localStream) {
      const peer = new Peer({ initiator: true, stream: localStream });
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

  socket.on('userJoined', (data: any) => {
    const clientId = data.socketId;

    if (connections.has(clientId) || clientId === socket.id || !localStream) {
      return;
    }

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
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!socket.current.id) return;

    socket.current.emit('getUsers', {
      from: socket.current.id,
      roomId: groupId,
    });
    socket.current.on('gotUsers', ({ users }: { users: User[] }) => {
      setUsers(users);
    });
  }, [groupId, socket.current.id]);

  const connect = (userData: { name: string }) => {
    initializeSocketHandler({
      groupId,
      localStream,
      setStreams,
      userData,
      connections: connections.current,
      socket: socket.current,
    });
    setIsConnected(true);
  };

  const disconnect = () => {
    connections.current.forEach(connection => connection.destroy());
    socket.current.emit('userDisconnected', {
      socketId: socket.current.id,
    });
    setIsConnected(false);
  };

  useEffect(() => {
    return function onUnmount() {
      disconnect();
    };
  }, []);

  const enhancedStreams = users.reduce((acc, user) => {
    const stream = streams?.[user.id]?.stream;

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
