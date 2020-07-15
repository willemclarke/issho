import dotenv from 'dotenv';
import express from 'express';
import path from 'path';
import socketio from 'socket.io';
import _ from 'lodash';
import { IsshoSocket, Messages } from '../common/types';
import { RoomManager, RoomManagerError } from './roomManager';

dotenv.config();

const app = express();
const http = require('http').createServer(app);
const io = socketio(http);
const port = process.env.PORT || 3000;

const roomManager = new RoomManager();

io.on('connection', (socket: IsshoSocket) => {
  socket.on(Messages.CAN_JOIN_ROOM_REQUEST, (info) => {
    const { roomId, username } = info;

    if (roomManager.canJoinRoom(roomId, username)) {
      socket.emit(Messages.CAN_JOIN_ROOM_RESPONSE, { error: null, username, roomId });
    } else {
      socket.emit(Messages.CAN_JOIN_ROOM_RESPONSE, {
        error: `User ${username} already exists within the room: ${roomId}, please choose another username`,
      });
    }
  });

  socket.on(Messages.JOIN_ROOM_REQUEST, async (info) => {
    const { roomId, username } = info;

    const joinRoomResp = roomManager.joinRoom(roomId, username);

    switch (joinRoomResp) {
      case undefined: {
        // Join the room in SocketIO land
        socket.user = { roomId, username };
        socket.join(roomId);
        // Send room status back to ALL clients
        io.in(roomId).emit(Messages.ROOM_STATUS_RESPONSE, roomManager.getRoomStatus(roomId));
        break;
      }
      case RoomManagerError.JOIN_ROOM_DUPLICATE_USER: {
        //TODO: Match on this error
        socket.emit(Messages.INVALID_JOIN_ROOM_RESPONSE, {
          errorMessage: `User ${username} already exists within the room: ${roomId}, please choose another username `,
        });
      }
    }
  });

  socket.on(Messages.ROOM_VIDEO_STATE_REQUEST, (msg) => {
    roomManager.setVideoState(msg.roomId, msg.roomVideoPlayerState);
    socket
      .to(msg.roomId)
      .emit(Messages.ROOM_STATUS_RESPONSE, roomManager.getRoomStatus(msg.roomId));
  });

  socket.on('disconnecting', () => {
    _.each(Object.keys(socket.rooms), (roomId) => {
      socket.leave(roomId, () => {
        if (socket.user) {
          roomManager.leaveRoom(roomId, socket.user.username);
          io.in(roomId).emit(Messages.ROOM_STATUS_RESPONSE, roomManager.getRoomStatus(roomId));
        }
      });
    });
  });
});

app.get('/rooms/:roomId/debug', (req, res) => {
  res.json(roomManager.getRoomStatus(req.params.roomId));
});

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.resolve(__dirname, '../client')));
}

http.listen(port, () => {
  console.log(`gurupu listening at http://localhost:${port}`);
});
