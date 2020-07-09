import express, { Request, Response } from 'express';
import socketio, { Socket } from 'socket.io';
import path from 'path';
import { Messages, User, RoomStatus, IsshoSocket } from '../common/types';
import _ from 'lodash';

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const port = 3000;

const getRoomStatus = (roomId: string): RoomStatus => {
  const sockets = io.sockets.sockets as { [id: string]: IsshoSocket };
  const users = _.compact(Object.entries(sockets).map(([id, socket]) => socket.user));
  const usersInRoom = _.filter(users, (user) => user.roomId === roomId);

  return {
    roomId,
    users: usersInRoom,
  };
};

io.on('connection', (socket: IsshoSocket) => {
  socket.on(Messages.CAN_JOIN_ROOM_REQUEST, (info) => {
    const { roomId, username } = info;

    const roomStatus = getRoomStatus(roomId);

    const existingUser = _.find(roomStatus.users, (user) => user.username === username);
    if (existingUser) {
      socket.emit(Messages.CAN_JOIN_ROOM_RESPONSE, {
        error: `User ${username} already exists within the room: ${roomId}, please choose another username`,
      });
    } else {
      socket.emit(Messages.CAN_JOIN_ROOM_RESPONSE, { error: null, username, roomId });
    }
  });

  socket.on(Messages.JOIN_ROOM_REQUEST, async (info) => {
    const { roomId, username } = info;
    const roomStatus = getRoomStatus(roomId);

    const existingUser = _.find(roomStatus.users, (user) => user.username === username);
    if (existingUser) {
      return socket.emit(Messages.INVALID_JOIN_ROOM, {
        errorMessage: `User ${username} already exists within the room: ${roomId}, please choose another username `,
      });
    }

    // Join the room in SocketIO land
    socket.user = { roomId, username };
    socket.join(roomId);

    // Send room status back to ALL clients
    io.in(roomId).emit(Messages.ROOM_STATUS, getRoomStatus(roomId));
  });

  socket.on(Messages.SEND_ROOM_VIDEO_STATE, (info) => {
    console.log('HERE', info);
    socket.to(info.id).emit(Messages.SYNCED_ROOM_VIDEO_STATE, info);
  });

  socket.on('disconnecting', () => {
    _.each(Object.keys(socket.rooms), (roomId) => {
      socket.leave(roomId, () => {
        io.in(roomId).emit(Messages.ROOM_STATUS, getRoomStatus(roomId));
      });
    });
  });

  socket.on('disconnect', () => {});
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client')));
}

http.listen(port, () => {
  console.log(__dirname, 'blah');
  console.log(`gurupu listening at http://localhost:${port}`);
});
