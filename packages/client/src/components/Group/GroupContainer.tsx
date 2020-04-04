import React, { useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

import useCurrentUser from '../../lib/hooks/useCurrentUser';
import useGroup from '../../lib/hooks/useGroup';
import Preview from './components/Preview';
import Group from './Group';
import useMediaStream from './lib/useLocalMediaStream';
import useMute from './lib/useMute';
import useToggleCamera from './lib/useToggleCamera';

interface Props {
  match: {
    params: {
      groupId: string;
    };
  };
}

type SetStreamsState = React.Dispatch<
  React.SetStateAction<{
    [key: string]: {
      userId: string;
      stream: MediaStream;
    };
  }>
>;

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
    console.log('new stream arrived .. ', peerId);
    setStreams(prevStreams => {
      return {
        ...prevStreams,
        [peerId]: { userId: peerId, stream },
      };
    });
  });

  peer.on('close', function() {
    console.log('connection closed .. ', peerId);
    setStreams(prevStreams => {
      const newStreams = { ...prevStreams };
      delete newStreams[peerId];

      return newStreams;
    });
  });
}

function initializeSocket({
  socket,
  localStream,
  connections,
  setStreams,
  groupId,
}: {
  socket: SocketIOClient.Socket;
  localStream?: MediaStream;
  groupId: string;
  connections: Map<string, Peer.Instance>;
  setStreams: SetStreamsState;
}) {
  socket.emit('userJoinedCall', {
    groupId,
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

export default function GroupContainer(props: Props) {
  const groupId = props.match.params.groupId;
  const group = useGroup(groupId);
  const currentUser = useCurrentUser();

  const [streams, setStreams] = useState<{
    [key: string]: { userId: string; stream: MediaStream };
  }>({});

  const [hasJoinedCall, setHasJoinedCall] = useState(false);

  const connections = useRef<Map<string, Peer.Instance>>(new Map([]));

  const socket = useRef(io('http://localhost:8080'));

  const { localStream } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);

  function onJoinCall() {
    setHasJoinedCall(true);
    initializeSocket({
      localStream,
      groupId,
      setStreams,
      connections: connections.current,
      socket: socket.current,
    });
  }

  const onHangup = () => {
    setHasJoinedCall(false);
    connections.current.forEach(connection => connection.destroy());
    socket.current.emit('userDisconnected', {
      socketId: socket.current.id,
    });
    localStream?.getTracks().forEach(track => track.stop());
    window.history.pushState(null, '', '/');
  };

  if (!hasJoinedCall && localStream) {
    return (
      <Preview
        groupName={group.data?.name || ''}
        isCameraOff={isCameraOff}
        isMuted={isMuted}
        onJoin={onJoinCall}
        stream={localStream}
        toggleCamera={toggleCamera}
        toggleIsMuted={toggleIsMuted}
      />
    );
  }

  if (localStream) {
    return (
      <>
        <Group
          onHangup={onHangup}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          localStream={localStream}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
        />
      </>
    );
  }

  return null;
}
