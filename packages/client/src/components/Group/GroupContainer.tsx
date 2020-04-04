import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';

import useCurrentUser from '../../lib/hooks/useCurrentUser';
import useGroup from '../../lib/hooks/useGroup';
import Preview from './components/Preview';
import Group from './Group';

interface Props {
  match: {
    params: {
      groupId: string;
    };
  };
}

async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return stream;
}

export default function GroupContainer(props: Props) {
  const groupId = props.match.params.groupId;
  const group = useGroup(groupId);
  const currentUser = useCurrentUser();
  const [streams, setStreams] = useState<{
    [key: string]: { userId: string; stream: MediaStream };
  }>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const [hasJoinedCall, setHasJoinedCall] = useState(false);

  const connections = useRef<Map<string, Peer.Instance>>(new Map([]));

  const socket = useRef(io('http://localhost:8080'));

  const [localStream, setLocalStream] = useState<MediaStream | null>(null);

  function peerCreated(peerId: string, peer: Peer.Instance) {
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

  function call() {
    setHasJoinedCall(true);
    socket.current.emit('userJoinedCall', {
      groupId,
      socketId: socket.current.id,
    });

    socket.current.on('gotSignal', (data: any) => {
      connections.current?.get(data.from)?.signal(data.signal);
    });

    socket.current.on('ack', (data: any) => {
      if (data.ack && localStream) {
        const peer = new Peer({ initiator: true, stream: localStream });
        connections.current.set(data.from, peer);

        peer.on('signal', function(signalData) {
          socket.current.emit('sendSignal', {
            to: data.from,
            signal: signalData,
          });
        });
        peerCreated(data.from, peer);
      }
    });

    socket.current.on('userJoined', (data: any) => {
      const clientId = data.socketId;

      if (
        connections.current.has(clientId) ||
        clientId === socket.current.id ||
        !localStream
      ) {
        return;
      }

      const connection = new Peer({ stream: localStream });

      connection.on('signal', (data: any) => {
        socket.current.emit('sendSignal', {
          to: clientId,
          signal: data,
        });
      });

      peerCreated(clientId, connection);

      socket.current.emit('ack', { to: clientId, from: socket.current.id });

      connections.current.set(clientId, connection);
    });
  }

  const hangup = () => {
    setHasJoinedCall(false);
    connections.current.forEach(connection => connection.destroy());
    socket.current.emit('userDisconnected', {
      socketId: socket.current.id,
    });
    localStream?.getTracks().forEach(track => track.stop());
    window.history.pushState(null, '', '/');
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const toggleIsMuted = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    const track = localStream?.getVideoTracks()[0];
    if (!track) return;

    if (isCameraOff) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isCameraOff]);

  useEffect(() => {
    const track = localStream?.getAudioTracks()[0];
    if (!track) return;

    if (isMuted) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isMuted]);

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      stream = await getLocalStream();

      setLocalStream(stream);
    })();
    return function cleanup() {
      hangup();
      localStream?.getTracks().forEach(track => track.stop());
    };
  }, []);

  if (!hasJoinedCall && localStream) {
    return (
      <Preview
        onJoin={call}
        groupName={group.data?.name || ''}
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
          hangup={hangup}
          localStream={{
            userId: currentUser.uid,
            stream: localStream,
          }}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
        />
      </>
    );
  }

  return null;
}
