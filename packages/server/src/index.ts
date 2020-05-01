import http from 'http';
import socketIo from 'socket.io';

import { handleUserIsInPreview } from './socketEventHandlers';

interface User {
  avatarUrl?: string;
  id?: string;
  isMuted: boolean;
  isCameraOff: boolean;
  name?: string;
}

export interface ExtendedSocket extends SocketIO.Socket {
  userData: User;
}

const PORT = process.env.PORT || 8080;

const app = http.createServer((req, res) => {
  res.write('ok');
  res.end();
});

const io = socketIo(app);

app.listen(PORT);
console.log(`🚀 Server started, listening on :${PORT}`);

function emitAllUsersToRoom(roomId: string) {
  io.in(roomId).clients((err: string, clients: string[]) => {
    const users = clients.map((socketId: string) => {
      const clientSocket = io.sockets.sockets[socketId] as ExtendedSocket;
      return clientSocket.userData;
    });

    console.log(clients);

    io.in(roomId).emit('gotUsers', { users });
  });
}

io.on('connection', (socket: ExtendedSocket) => {
  let room: string;

  socket.on('userIsInPreview', handleUserIsInPreview(socket));

  socket.on(
    'userJoinedCall',
    (data: { groupId: string; socketId: string; userData: User }) => {
      room = data.groupId;
      const socketId = data.socketId;

      socket.userData = { ...data.userData, id: socketId };

      socket.to(room).emit('userJoined', {
        socketId,
        userData: data.userData,
      });

      emitAllUsersToRoom(room);
    },
  );

  socket.on('getUsers', ({ roomId }: { from: string; roomId: string }) => {
    emitAllUsersToRoom(roomId);
  });

  socket.on('userUpdated', (userData: User) => {
    socket.userData = { ...socket.userData, ...userData };
  });

  socket.on(
    'sendSignal',
    (data: { signal: {}; to: string; socket: ExtendedSocket }) => {
      io.to(data.to).emit('gotSignal', {
        signal: data.signal,
        from: socket.id,
      });
    },
  );

  socket.on(
    'ack',
    (data: { to: string; from: string; ack: boolean; userData: User }) => {
      io.to(data.to).emit('ack', {
        from: data.from,
        ack: true,
        userData: socket.userData,
      });
    },
  );

  socket.on('userIsLeavingRoom', (data: { socketId: string }) => {
    const socketId = data.socketId;
    socket.to(room).emit('userLeftRoom', {
      socketId,
    });

    const { isMuted, isCameraOff } = socket.userData || {};
    socket.userData = { isMuted, isCameraOff };

    emitAllUsersToRoom(room);
  });

  socket.on('sendChatMessage', ({ msg }: { msg: string }) => {
    io.in(room).emit('receivedChatMessage', {
      message: msg,
      user: socket.userData,
      createdAt: new Date().getTime(),
    });
  });
});
