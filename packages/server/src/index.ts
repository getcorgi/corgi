import http from 'http';
import socketIo, { Socket } from 'socket.io';

const app = http.createServer();
const io = socketIo(app);

app.listen(8080);

io.on('connection', (socket: Socket) => {
  let room: string;

  socket.on('userJoinedCall', (data: { groupId: string; socketId: string }) => {
    room = data.groupId;
    const socketId = data.socketId;

    socket.join(data.groupId, () => {
      socket.to(room).emit('userJoined', {
        socketId,
      });
    });
  });

  socket.on(
    'sendSignal',
    (data: { signal: {}; to: string; socket: Socket }) => {
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
  });
});
