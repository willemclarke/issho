import express, { Request, Response } from 'express';
import socketio, { Socket, Namespace } from 'socket.io';
import { Messages, User, RoomStatus } from '../common/types';
import _ from 'lodash';

interface GurupuSocket extends Socket {
  user: User;
}

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const port = 3000;

function getUser(socket: GurupuSocket): User {
  return socket.user;
}

function getUsers(sockets: { [id: string]: GurupuSocket }): User[] {
  // Not using (_lodash) map due to type inference issues on overload.
  // Using _.compact as some sockets don't have users
  return _.compact(Object.entries(sockets).map(([id, socket]) => getUser(socket)));
}

function getUsersForRoom(roomId: string, users: User[]): User[] {
  return _.filter(users, (user) => user.roomId === roomId);
}

io.on('connection', (socket: GurupuSocket) => {
  socket.on(Messages.JOIN_ROOM, async (info) => {
    console.log('User joined', info);

    const { roomId, username } = info;

    socket.join(roomId);
    socket.user = { roomId, username };

    const sockets = io.sockets.sockets as { [id: string]: GurupuSocket };
    const users = getUsers(sockets);
    const usersInRoom = getUsersForRoom(roomId, users);
    const roomStatus: RoomStatus = {
      id: roomId,
      users: usersInRoom,
    };

    socket.emit(Messages.ROOM_STATUS, roomStatus);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World');
});

http.listen(port, () => {
  console.log(`gurupu listening at http://localhost:${port}`);
});
