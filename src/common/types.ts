export enum Messages {
  JOIN_ROOM = 'join-room',
  ROOM_STATUS = 'room-status',
}

export interface User {
  username: string;
}

export interface Room {
  id: string;
  users: User[];
}

export interface RoomStatus {
  id: string;
  users: User[];
}
