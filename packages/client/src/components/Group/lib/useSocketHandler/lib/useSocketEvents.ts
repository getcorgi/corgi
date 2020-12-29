import { useEffect } from 'react';
import Peer from 'simple-peer';

import { Options, User } from '../types';
import onPeerCreated from './onPeerCreated';

export default function useSocketEvents({
  connections,
  groupId,
  isInRoom,
  localStream,
  myUserData,
  playUserJoinedBloop,
  setStreams,
  setUsers,
  socket,
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
        connection?.peer?.destroy();

        connections.delete(socketId);
      }
    };

    const onSyncUsers = ({ users }: { users: User[] }) => {
      if (!users?.length) return;
      setUsers(users.filter(Boolean));

      users.forEach(user => addNewUser(user));
    };

    const addNewUser = (userData: User) => {
      if (
        !userData?.id ||
        (userData.id && connections.has(userData.id)) ||
        userData.id === socket.id
      ) {
        return;
      }
      const peer = new Peer({ stream: localStream });

      peer.on('signal', (data: Record<string, unknown>) => {
        socket.emit('sendSignal', {
          to: userData.id,
          signal: data,
        });
      });

      onPeerCreated({ peerId: userData.id, peer, setStreams, connections });

      socket.emit('ack', {
        to: userData.id,
        from: socket.id,
        userData: myUserData,
      });

      connections.set(userData.id, { peer, userData: userData });

      return true;
    };

    const onUserJoined = (data: { socketId: string; userData: User }) => {
      const userAdded = addNewUser(data.userData);

      if (userAdded) {
        playUserJoinedBloop({});
      }
    };

    const listeners = {
      gotSignal: onGotSignal,
      ack: onAck,
      userLeftRoom: onUserLeftRoom,
      userJoined: onUserJoined,
      syncUsers: onSyncUsers,
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
    isInRoom,
    localStream,
    myUserData,
    playUserJoinedBloop,
    setStreams,
    setUsers,
    socket,
  ]);
}
