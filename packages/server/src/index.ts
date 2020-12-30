import http from 'http';
import socketIo from 'socket.io';

import { handleUserIsInPreview } from './socketEventHandlers';
import { ExtendedSocket, User } from './types';

const PORT = process.env.PORT || 8080;

const app = http.createServer((req, res) => {
  res.write('ok');
  res.end();
});

const io = socketIo(app);

app.listen(PORT);
console.log(`🚀 Server started, listening on :${PORT}`);

function getAllUsers(roomId: string, callback: (users: User[]) => void) {
  io.in(roomId).clients((err: string, clients: string[]) => {
    const users = clients.map((socketId: string) => {
      const clientSocket = io.sockets.sockets[socketId] as ExtendedSocket;
      return clientSocket.userData;
    });

    callback(users);
  });
}

function emitAllUsersToRoom(roomId: string) {
  getAllUsers(roomId, users => {
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
        userData: socket.userData,
      });

      emitAllUsersToRoom(room);
    },
  );

  socket.on('getUsers', ({ roomId }: { from: string; roomId: string }) => {
    emitAllUsersToRoom(roomId);
  });

  socket.on(
    'syncUsers',
    ({ roomId, fromId }: { roomId: string; fromId: string }) => {
      getAllUsers(roomId, users => {
        io.to(fromId).emit('syncUsers', { users });
      });
    },
  );

  socket.on('userUpdated', (userData: User) => {
    socket.userData = { ...socket.userData, ...userData };
  });

  socket.on(
    'sendSignal',
    (data: {
      signal: Record<string, unknown>;
      to: string;
      socket: ExtendedSocket;
    }) => {
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

  socket.on(
    'sendYoutubeSyncData',
    ({ data }: { data: Record<string, unknown> }) => {
      io.in(room).emit('receivedYoutubeSyncData', {
        data,
        user: socket.userData,
      });
    },
  );

  socket.on(
    'DrawActivity::drawing',
    (data: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      color: string;
    }) => {
      socket.to(room).emit('DrawActivity::receivedDrawing', data);
    },
  );
});
