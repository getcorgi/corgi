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

  console.log(isScreenSharePeerConnected);

  const disconnectScreenShare = () => {
    stopScreenShare();
  };

  const connectScreenShare = () => {
    startScreenShare();
  };

  const onStreamEnded = () => {
    setIsScreenSharePeerConnected(false);

    socket.current.emit('userIsLeavingRoom', {
      socketId: socket.current.id,
    });

    connections.current = new Map([]);
    // socket.current.close();
  };
  const onStreamStarted = () => {
    setIsScreenSharePeerConnected(true);
  };

  const {
    isSharingScreen,
    screenShareStream,
    startScreenShare,
    stopScreenShare,
  } = useScreenShare({ onStreamEnded, onStreamStarted });

  const localScreenShareStreamRef = useRef(screenShareStream);

  useScreenShareSocketEvents({
    groupId,
    localStream: screenShareStream,
    myUserData: userData,
    connections: connections.current,
    socket: socket.current,
    isScreenSharePeerConnected,
  });

  const destroySocket = useCallback(() => {
    disconnectScreenShare();
    socket.current.close();
  }, [socket]);

  useEffect(() => {
    window.addEventListener('beforeunload', destroySocket);

    return () => {
      window.removeEventListener('beforeunload', destroySocket);
    };
  }, [destroySocket]);

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
      destroySocket();
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    disconnectScreenShare,
    connectScreenShare,
    isScreenSharePeerConnected,
  };
}
