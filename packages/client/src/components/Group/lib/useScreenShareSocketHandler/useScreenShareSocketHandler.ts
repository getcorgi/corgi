import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

import { appConfig } from '../../../../constants';
import useScreenShareSocketEvents from './lib/useScreenShareSocketEvents';
import { Connections, User } from './types';

export default function useSocketHandler({
  localScreenShareStream,
  groupId,
  userData,
}: {
  groupId: string;
  localScreenShareStream?: MediaStream;
  userData: User;
}) {
  const socket = useRef(io(appConfig.socketServer));
  const connections = useRef<Connections>(new Map([]));

  const [isScreenSharePeerConnected, setIsScreenSharePeerConnected] = useState(
    false,
  );
  const localScreenShareStreamRef = useRef(localScreenShareStream);

  useScreenShareSocketEvents({
    groupId,
    localStream: localScreenShareStream,
    myUserData: userData,
    connections: connections.current,
    socket: socket.current,
    isScreenSharePeerConnected,
  });

  const connectScreenShare = () => {
    setIsScreenSharePeerConnected(true);
  };

  const disconnectScreenShare = useCallback(() => {
    socket.current.emit('userIsLeavingRoom', {
      socketId: socket.current.id,
    });

    connections.current = new Map([]);

    setIsScreenSharePeerConnected(false);
  }, []);

  const disconnect = useCallback(() => {
    disconnectScreenShare();
    socket.current.close();
  }, [disconnectScreenShare]);

  useEffect(() => {
    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, [disconnect]);

  useEffect(() => {
    if (
      isScreenSharePeerConnected &&
      localScreenShareStream !== localScreenShareStreamRef.current
    ) {
      connections.current.forEach(({ peer }) => {
        if (
          peer &&
          localScreenShareStreamRef.current &&
          localScreenShareStream
        ) {
          peer.removeStream(localScreenShareStreamRef.current);
          peer.addStream(localScreenShareStream);
        }
      });

      localScreenShareStreamRef.current = localScreenShareStream;
    }
  }, [localScreenShareStream, isScreenSharePeerConnected]);

  useEffect(() => {
    return function onUnmount() {
      disconnect();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    disconnectScreenShare,
    connectScreenShare,
    isScreenSharePeerConnected,
  };
}
