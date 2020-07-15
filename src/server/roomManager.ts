import { RoomStatus, RoomVideoPlayerState } from '../common/types';
import _ from 'lodash';

interface RoomStore {
  [roomId: string]: RoomStatus;
}

export enum RoomManagerError {
  JOIN_ROOM_DUPLICATE_USER,
}

type RoomManagerResponse<A> = A | RoomManagerError;

export class RoomManager {
  store: RoomStore;

  constructor() {
    this.store = {};
  }

  canJoinRoom(roomId: string, username: string): boolean {
    const roomStatus = this.getRoomStatus(roomId);

    if (!roomStatus) {
      return true;
    }

    const userAlreadyExists = _.find(roomStatus.users, (user) => user.username === username);
    if (userAlreadyExists) {
      return false;
    }

    return true;
  }

  joinRoom(roomId: string, username: string): RoomManagerResponse<void> {
    if (!this.canJoinRoom(roomId, username)) {
      return RoomManagerError.JOIN_ROOM_DUPLICATE_USER;
    }

    const roomStatus = this.getRoomStatus(roomId);

    // If no existing room, create room
    if (!roomStatus) {
      this.store[roomId] = {
        roomId,
        users: [
          {
            username,
            roomId,
          },
        ],
        videoPlayerState: {
          playing: false,
          url: 'https://www.youtube.com/watch?v=TSN5r_UfIXQ',
        },
      };
    } else {
      this.store[roomId] = {
        ...roomStatus,
        users: _.concat(roomStatus.users, [
          {
            username,
            roomId,
          },
        ]),
      };
    }
  }

  leaveRoom(roomId: string, username: string): void {
    const roomStatus = this.getRoomStatus(roomId);

    if (!roomStatus) {
      return;
    }

    const users = _.reject(roomStatus.users, (user) => user.username === username);
    if (!_.isEmpty(users)) {
      this.store[roomId] = {
        ...roomStatus,
        users,
      };
    } else {
      this.store = _.omit(this.store, roomId);
    }
  }

  getRoomStatus(roomId: string): RoomStatus | undefined {
    return _.get(this.store, roomId, undefined);
  }

  setVideoState(roomId: string, videoPlayerState: RoomVideoPlayerState): void {
    const roomStatus = this.getRoomStatus(roomId);

    if (!roomStatus) {
      return;
    }

    this.store[roomId].videoPlayerState = videoPlayerState;
  }

  addToPlaylist(roomId: string, username: string, url: string): void {}

  removeFromPlaylist(roomId: string, username: string, url: string): void {}
}
