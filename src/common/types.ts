export enum Messages {
  JOIN_ROOM = 'join-room',
  JOINED_ROOM = 'joined-room',
  ROOM_STATUS = 'room-status',
  VALIDATED_JOIN_ROOM = 'validated-join-room',
  INVALID_JOIN_ROOM = 'invalid-join-room',
  SEND_ROOM_VIDEO_STATE = 'send-room-video-state',
  SYNCED_ROOM_VIDEO_STATE = 'synced-room-video-state',
}

export interface User {
  roomId: string;
  username: string;
}

export interface RoomStatus {
  id: string;
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
}
