import { useCallback, useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

import { appConfig } from '../../../../constants';
import useScreenShareSocketEvents from './lib/useScreenShareSocketEvents';
import { Connections, User } from './types';
import useScreenShare from '../useScreenShare';

export default function useSocketHandler({
  groupId,
  userData,
}: {
  groupId: string;
  userData: User;
}) {
  const socket = useRef(io(appConfig.socketServer));
  const connections = useRef<Connections>(new Map([]));

  const [isScreenSharePeerConnected, setIsScreenSharePeerConnected] = useState(
    false,
  );

  const {
    isSharingScreen,
    screenShareStream,
    startScreenShare,
    stopScreenShare,
  } = useScreenShare();

  const localScreenShareStreamRef = useRef(screenShareStream);

  useScreenShareSocketEvents({
    groupId,
    localStream: screenShareStream,
    myUserData: userData,
    connections: connections.current,
    socket: socket.current,
    isScreenSharePeerConnected,
  });

  const connectScreenShare = async () => {
    await startScreenShare();
    setIsScreenSharePeerConnected(true);
  };

  const disconnectScreenShare = useCallback(() => {
    stopScreenShare();
    socket.current.emit('userIsLeavingRoom', {
      socketId: socket.current.id,
    });

    connections.current = new Map([]);

    setIsScreenSharePeerConnected(false);
  }, [screenShareStream]);

  const disconnect = useCallback(() => {
    disconnectScreenShare();
    socket.current.close();
  }, [disconnectScreenShare, screenShareStream]);

  useEffect(() => {
    if (!isSharingScreen && isScreenSharePeerConnected) {
      disconnect();
    }
  }, [isSharingScreen]);

  useEffect(() => {
    window.addEventListener('beforeunload', disconnect);

    return () => {
      window.removeEventListener('beforeunload', disconnect);
    };
  }, [disconnect]);

  useEffect(() => {
    if (
      isScreenSharePeerConnected &&
      screenShareStream !== localScreenShareStreamRef.current
    ) {
      connections.current.forEach(({ peer }) => {
        if (peer && localScreenShareStreamRef.current && screenShareStream) {
          peer.removeStream(localScreenShareStreamRef.current);
          peer.addStream(screenShareStream);
        }
      });

      localScreenShareStreamRef.current = screenShareStream;
    }
  }, [screenShareStream, isScreenSharePeerConnected]);

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
