import { Socket } from 'socket.io';

export interface IsshoSocket extends Socket {
  user: User;
}
export enum Messages {
  CAN_JOIN_ROOM_REQUEST = 'can-join-room-request',
  CAN_JOIN_ROOM_RESPONSE = 'can-join-room-response',
  JOIN_ROOM_REQUEST = 'join-room-request',
  ROOM_STATUS_RESPONSE = 'room-status-response',
  INVALID_JOIN_ROOM_RESPONSE = 'invalid-join-room-response',
  ROOM_VIDEO_STATE_REQUEST = 'room-video-state-request',
}

export interface User {
  roomId: string;
  username: string;
}

// Type we share across the room.
export interface RoomVideoPlayerState {
  playing: boolean;
  url: string;
}

export interface RoomPlaylistEntry {
  url: string;
  name: string;
  thumbnailUrl: string;
  addedByUsername: string;
}

export interface RoomStatus {
  roomId: string;
  users: User[];
  videoPlayerState: RoomVideoPlayerState;
  playlist: RoomPlaylistEntry[];
}
