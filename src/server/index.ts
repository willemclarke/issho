import express, { Request, Response } from 'express';
import socketio, { Socket } from 'socket.io';
import { Room, Messages, User } from '../common/types';

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const port = 3000;

let id = '';
let users: User[] = [];

io.on('connection', (socket: Socket) => {
  console.log('A user connected');

  socket.on(Messages.JOIN_ROOM, (info) => {
    console.log('User joined', info);
    socket.join(info.roomId); //roomId not defined atm

    id = info.roomId;
    users.push({ username: info.username });

    socket.emit(Messages.ROOM_STATUS),
      {
        users: users,
        id: id,
      };
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World');
  });

  http.listen(port, () => {
    console.log(`gurupu listening at http://localhost:${port}`);
  });
});
