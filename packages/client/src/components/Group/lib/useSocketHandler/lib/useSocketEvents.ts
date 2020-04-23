import { useEffect } from 'react';
import Peer from 'simple-peer';

import { Options, User } from '../types';
import onPeerCreated from './onPeerCreated';

export default function useSocketEvents({
  connections,
  groupId,
  localStream,
  myUserData,
  playUserJoinedBloop,
  playUserLeftBloop,
  setStreams,
  socket,
  isInRoom,
}: Options) {
  useEffect(() => {
    if (!isInRoom) return;

    socket.emit('userJoinedCall', {
      groupId,
      userData: myUserData,
      socketId: socket.id,
    });

    const onGotSignal = (data: { from: string; signal: string }) => {
      const connection = connections.get(data.from);

      connection?.peer.signal(data.signal);
    };

    const onAck = (data: { ack: boolean; userData: User; from: string }) => {
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
    };

    const onUserLeftRoom = ({ socketId }: { socketId: string }) => {
      const connection = connections.get(socketId);
      if (connection?.peer) {
        playUserLeftBloop({});
        connection?.peer?.destroy();

        connections.delete(socketId);
      }
    };

    const onUserJoined = (data: { socketId: string; userData: User }) => {
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

      socket.emit('ack', {
        to: clientId,
        from: socket.id,
        userData: myUserData,
      });

      connections.set(clientId, { peer, userData: data.userData });
    };

    const listeners = {
      gotSignal: onGotSignal,
      ack: onAck,
      userLeftRoom: onUserLeftRoom,
      userJoined: onUserJoined,
    };

    Object.entries(listeners).forEach(([event, callback]) => {
      socket.on(event, callback);
    });

    return function cleanup() {
      Object.keys(listeners).forEach(event => {
        socket.removeEventListener(event);
      });
    };
  }, [
    isInRoom,
    connections,
    groupId,
    myUserData,
    localStream,
    playUserJoinedBloop,
    playUserLeftBloop,
    setStreams,
    socket,
  ]);
}
