import { useEffect } from 'react';
import Peer from 'simple-peer';

import { Options, User } from '../types';

export default function useScreenShareSocketEvents({
  connections,
  groupId,
  isScreenSharePeerConnected,
  localStream,
  myUserData,
  socket,
}: Options) {
  useEffect(() => {
    if (!isScreenSharePeerConnected) return;

    socket.emit('userIsInPreview', { roomId: groupId });

    socket.emit('userJoinedCall', {
      groupId,
      userData: {
        ...myUserData,
        isCameraOff: false,
        isMuted: false,
        name: `${myUserData.name}'s Screen Share`,
      },
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
      }
    };

    const onUserLeftRoom = ({ socketId }: { socketId: string }) => {
      const connection = connections.get(socketId);
      if (connection?.peer) {
        connection?.peer?.destroy();

        connections.delete(socketId);
      }
    };

    const onUserJoined = (data: { socketId: string; userData: User }) => {
      const clientId = data.socketId;

      if (connections.has(clientId) || clientId === socket.id) {
        return;
      }

      const peer = new Peer({ stream: localStream });

      peer.on('signal', (data: any) => {
        socket.emit('sendSignal', {
          to: clientId,
          signal: data,
        });
      });

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
    connections,
    groupId,
    isScreenSharePeerConnected,
    localStream,
    myUserData,
    socket,
  ]);
}
