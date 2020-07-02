import { appConfig } from 'lib/constants';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import io from 'socket.io-client';

import useScreenShare from '../useScreenShare';
import useScreenShareSocketEvents from './lib/useScreenShareSocketEvents';
import { Connections, User } from './types';

export default function useSocketHandler({
  groupId,
  userData,
}: {
  groupId: string;
  userData: User;
}) {
  const socket = useMemo(() => {
    return {
      current: io(appConfig.socketServer, {
        transports: ['websocket'],
      }),
    };
  }, []);
  const connections = useRef<Connections>(new Map([]));

  const [isScreenSharePeerConnected, setIsScreenSharePeerConnected] = useState(
    false,
  );

  const connectScreenShare = () => {
    startScreenShare();
  };

  const onStreamEnded = () => {
    setIsScreenSharePeerConnected(false);

    socket.current.emit('userIsLeavingRoom', {
      socketId: socket.current.id,
    });

    connections.current = new Map([]);
  };
  const onStreamStarted = () => {
    setIsScreenSharePeerConnected(true);
  };

  const {
    screenShareStream,
    startScreenShare,
    stopScreenShare,
  } = useScreenShare({ onStreamEnded, onStreamStarted });

  const disconnectScreenShare = useCallback(() => {
    stopScreenShare();
  }, [stopScreenShare]);

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
  }, [socket, disconnectScreenShare]);

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
