import http from 'http';
import socketIo from 'socket.io';

interface User {
  name: string;
  id: string;
}

interface ExtendedSocket extends SocketIO.Socket {
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

io.on('connection', (socket: ExtendedSocket) => {
  let room: string;

  socket.on(
    'userJoinedCall',
    (data: {
      groupId: string;
      socketId: string;
      userData: Pick<User, 'name'>;
    }) => {
      room = data.groupId;
      const socketId = data.socketId;

      socket.userData = { ...data.userData, id: socketId };

      socket.join(data.groupId, () => {
        socket.to(room).emit('userJoined', {
          socketId,
          userData: data.userData,
        });
      });

      io.of('/')
        .in(room)
        .clients((err: string, clients: string[]) => {
          const users = clients.map((socketId: string) => {
            const clientSocket = io.sockets.sockets[socketId] as ExtendedSocket;
            return clientSocket.userData;
          });
          io.emit('gotUsers', { users });
        });
    },
  );

  socket.on(
    'getUsers',
    ({ roomId }: { from: string; roomId: string }) => {
      io.of('/')
        .in(roomId)
        .clients((err: string, clients: string[]) => {
          const users = clients.map((socketId: string) => {
            const clientSocket = io.sockets.sockets[socketId] as ExtendedSocket;
            return clientSocket.userData;
          });
          io.emit('gotUsers', { users });
        });
    },
  );

  socket.on(
    'sendSignal',
    (data: { signal: {}; to: string; socket: ExtendedSocket }) => {
      io.to(data.to).emit('gotSignal', {
        signal: data.signal,
        from: socket.id,
      });
    },
  );

  socket.on('ack', (data: { to: string; from: string; ack: boolean }) => {
    io.to(data.to).emit('ack', { from: data.from, ack: true });
  });

  socket.on('userDisconnected', (data: { socketId: string }) => {
    const socketId = data.socketId;
    socket.to(room).emit('userDisconnected', {
      socketId,
    });

    socket.leave(room, () => {
      io.of('/')
        .in(room)
        .clients((err: string, clients: string[]) => {
          const users = clients.map((socketId: string) => {
            const clientSocket = io.sockets.sockets[socketId] as ExtendedSocket;
            return clientSocket.userData;
          });
          io.emit('gotUsers', { users });
        });
    });
  });
});
