import _ from 'lodash';
import { RoomStatus, RoomVideoPlayerState } from '../common/types';
import { randomString } from '../common/utils';

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
          ended: false,
          currentPlaylistId: undefined,
        },
        playlist: [],
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

  handleVideoState(roomId: string, videoPlayerState: RoomVideoPlayerState): void {
    const roomStatus = this.getRoomStatus(roomId);

    if (!roomStatus) {
      return;
    }

    if (videoPlayerState.ended) {
      const currentIndex = _.findIndex(
        roomStatus.playlist,
        (entry) => entry.id === roomStatus.videoPlayerState.currentPlaylistId,
      );

      const nextPlaylistId = roomStatus.playlist[currentIndex + 1]?.id;
      videoPlayerState.currentPlaylistId = nextPlaylistId;
      videoPlayerState.playing = true;
      videoPlayerState.ended = false;
    }

    this.store[roomId].videoPlayerState = videoPlayerState;
  }

  addToPlaylist(
    roomId: string,
    options: {
      addedByUsername: string;
      url: string;
      title: string;
      channelTitle: string;
      thumbnailUrl: string;
    },
  ): void {
    const roomStatus = this.getRoomStatus(roomId);
    if (!roomStatus) {
      return;
    }
    const playlistWithEntryAdded = _.concat(roomStatus.playlist, {
      id: randomString(8),
      url: options.url,
      title: options.title,
      channelTitle: options.channelTitle,
      thumbnailUrl: options.thumbnailUrl,
      addedByUsername: options.addedByUsername,
    });
    this.store[roomId].playlist = playlistWithEntryAdded;

    // If first video added into the playlist -> immediately play
    if (playlistWithEntryAdded.length === 1) {
      this.store[roomId].videoPlayerState.currentPlaylistId = _.head(playlistWithEntryAdded)?.id;
      this.store[roomId].videoPlayerState.playing = true;
    }
  }

  deleteFromPlaylist(roomId: string, id: string): void {
    const roomStatus = this.getRoomStatus(roomId);
    if (!roomStatus) {
      return;
    }

    // If the entry we are deleting is the one we are currently playing:
    // Start playing the next item in the playlist

    if (roomStatus.videoPlayerState.currentPlaylistId === id) {
      const currentPlaylistIdIndex = _.findIndex(roomStatus.playlist, (entry) => entry.id === id);
      const nextPlaylistId = roomStatus.playlist[currentPlaylistIdIndex + 1]?.id;
      this.store[roomId].videoPlayerState.currentPlaylistId = nextPlaylistId;
    }

    const playlistWithEntryRemoved = _.reject(roomStatus.playlist, (entry) => entry.id === id);
    this.store[roomId].playlist = playlistWithEntryRemoved;
  }
}
