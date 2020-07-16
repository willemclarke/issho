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

const sendToAllInRoom = (options: { roomId: string; type: Messages; payload: any }): void => {
  io.in(options.roomId).emit(options.type, options.payload);
};

const sendToClient = (options: { socket: IsshoSocket; type: Messages; payload: any }): void => {
  options.socket.emit(options.type, options.payload);
};

const sendToAllExcludingClient = (options: {
  socket: IsshoSocket;
  roomId: string;
  type: Messages;
  payload: any;
}): void => {
  options.socket.to(options.roomId).emit(options.type, options.payload);
};

io.on('connection', (socket: IsshoSocket) => {
  socket.on(Messages.CAN_JOIN_ROOM_REQUEST, (info) => {
    const { roomId, username } = info;

    if (roomManager.canJoinRoom(roomId, username)) {
      sendToClient({
        socket,
        type: Messages.CAN_JOIN_ROOM_RESPONSE,
        payload: { error: null, username, roomId },
      });
    } else {
      sendToClient({
        socket,
        type: Messages.CAN_JOIN_ROOM_RESPONSE,
        payload: {
          error: `User ${username} already exists within the room: ${roomId}, please choose another username`,
        },
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
        sendToAllInRoom({
          roomId,
          type: Messages.ROOM_STATUS_RESPONSE,
          payload: roomManager.getRoomStatus(roomId),
        });
        break;
      }
      case RoomManagerError.JOIN_ROOM_DUPLICATE_USER: {
        sendToClient({
          socket,
          type: Messages.INVALID_JOIN_ROOM_RESPONSE,
          payload: {
            error: `User ${username} already exists within the room: ${roomId}, please choose another username`,
          },
        });
      }
    }
  });

  socket.on(Messages.ROOM_VIDEO_STATE_REQUEST, (msg) => {
    roomManager.handleVideoState(msg.roomId, msg.roomVideoPlayerState);
    const roomStatus = roomManager.getRoomStatus(msg.roomId);

    sendToAllInRoom({
      roomId: msg.roomId,
      type: Messages.ROOM_STATUS_RESPONSE,
      payload: roomStatus,
    });
  });

  socket.on(Messages.PLAYLIST_DELETE_REQUEST, (msg) => {
    roomManager.deleteFromPlaylist(msg.roomId, msg.id);
    sendToAllInRoom({
      roomId: msg.roomId,
      type: Messages.ROOM_STATUS_RESPONSE,
      payload: roomManager.getRoomStatus(msg.roomId),
    });
  });

  socket.on(Messages.PLAYLIST_ADD_REQUEST, (msg) => {
    console.log('socket users: ', socket.user);
    roomManager.addToPlaylist(msg.roomId, {
      addedByUsername: socket.user.username,
      url: msg.url,
      thumbnailUrl: msg.thumbnailUrl,
      title: msg.title,
      channelTitle: msg.channelTitle,
    });
    sendToAllInRoom({
      roomId: msg.roomId,
      type: Messages.ROOM_STATUS_RESPONSE,
      payload: roomManager.getRoomStatus(msg.roomId),
    });
  });

  socket.on('disconnecting', () => {
    _.each(Object.keys(socket.rooms), (roomId) => {
      socket.leave(roomId, () => {
        if (socket.user) {
          roomManager.leaveRoom(roomId, socket.user.username);
          sendToAllInRoom({
            roomId,
            type: Messages.ROOM_STATUS_RESPONSE,
            payload: roomManager.getRoomStatus(roomId),
          });
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
