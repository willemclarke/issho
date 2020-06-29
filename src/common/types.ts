export enum Messages {
  JOIN_ROOM = 'join-room',
  ROOM_STATUS = 'room-status',
  JOIN_ROOM_ERROR = 'join-room-error',
}

export interface User {
  roomId: string;
  username: string;
}

export interface RoomStatus {
  id: string;
  users: User[];
}
