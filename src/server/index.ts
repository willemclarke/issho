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

function getSockets(): { [id: string]: GurupuSocket } {
  return io.sockets.sockets as { [id: string]: GurupuSocket };
}

io.on('connection', (socket: GurupuSocket) => {
  socket.on(Messages.JOIN_ROOM, async (info) => {
    console.log('User joined', info);

    const { roomId, username } = info;

    const existingSockets = getSockets();
    const existingUsers = getUsers(existingSockets);
    const existingUsersInRoom = getUsersForRoom(roomId, existingUsers);
    const existingUser = _.find(existingUsersInRoom, (user) => user.username === username);

    if (existingUser) {
      return socket.emit(Messages.INVALID_JOIN_ROOM, {
        errorMessage: `User ${username} already exists within the room: ${roomId}, please choose another username `,
      });
    }

    socket.user = { roomId, username };
    socket.join(roomId);

    socket.emit(Messages.VALIDATED_JOIN_ROOM, true);
  });

  socket.on(Messages.JOINED_ROOM, (info) => {
    console.log('User joined room');

    const { roomId } = info;

    const sockets = getSockets();
    const users = getUsers(sockets);

    const roomStatus: RoomStatus = {
      id: roomId,
      users,
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
