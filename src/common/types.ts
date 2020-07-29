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
  ROOM_CHAT_STATE_REQUEST = 'room-chat-state-request',

  // Playlist requests
  PLAYLIST_DELETE_REQUEST = 'playlist-delete-request',
  PLAYLIST_ADD_REQUEST = 'playlist-add-request',

  // Chat requests
  ADD_MESSAGE_REQUEST = 'add-message-request',
  ADD_MESSAGE_RESPONSE = 'add-message-response',
  ADD_TYPING_REQUEST = 'add-typing-request',
  ADD_TYPING_RESPONSE = 'add-typing-response',
}

export interface User {
  roomId: string;
  username: string;
}

// Types we share across the room.
export interface RoomVideoPlayerState {
  playing: boolean;
  currentPlaylistId?: string;
  ended: boolean;
}

export interface RoomPlaylistEntry {
  id: string;
  url: string;
  title: string;
  channelTitle: string;
  thumbnailUrl: string;
  addedByUsername: string;
}

export interface RoomChatState {
  username: string;
  message: string;
  isTyping: boolean;
}

export interface RoomStatus {
  roomId: string;
  users: User[];
  videoPlayerState: RoomVideoPlayerState;
  playlist: RoomPlaylistEntry[];
  chatState: RoomChatState[];
}
