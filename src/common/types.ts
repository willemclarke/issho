import { Socket } from 'socket.io';

export interface IsshoSocket extends Socket {
  user: User;
}
export enum Messages {
  CAN_JOIN_ROOM_REQUEST = 'can-join-room-request',
  CAN_JOIN_ROOM_RESPONSE = 'can-join-room-respone',
  JOIN_ROOM_REQUEST = 'join-room',
  ROOM_STATUS = 'room-status',
  INVALID_JOIN_ROOM = 'invalid-join-room',
  SEND_ROOM_VIDEO_STATE = 'send-room-video-state',
  SYNCED_ROOM_VIDEO_STATE = 'synced-room-video-state',
}

export interface User {
  roomId: string;
  username: string;
}

export interface RoomStatus {
  roomId: string;
  users: User[];
}

// Type we share across the room.
export interface RoomVideoState {
  id: string;
  playing: boolean;
}

export interface VideoState {
  url: null | string;
  pip: boolean;
  playing: boolean;
  controls: boolean;
  light: boolean;
  volume: number;
  muted: boolean;
  played: number;
  loaded: number;
  duration: number;
  playbackRate: number;
  loop: boolean;
  lastAction: Date;
}
