import { appConfig } from 'lib/constants';
import React, { createContext } from 'react';
import io from 'socket.io-client';

const socket = io(appConfig.socketServer, {
  transports: ['websocket'],
});

export const SocketContext = createContext<{
  socket: SocketIOClient.Socket;
}>({
  socket,
});

export default function SocketProvider(props: { children: React.ReactNode }) {
  return (
    <SocketContext.Provider value={{ socket }}>
      {props.children}
    </SocketContext.Provider>
  );
}
