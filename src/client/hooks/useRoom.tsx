import React from 'react';
import { useParams } from 'react-router-dom';
import { Messages, RoomStatus } from '../../common/types';
import { useQuery } from '../hooks/useQuery';
import { Socket } from 'socket.io';
import useSocket from 'use-socket.io-client';

export interface RoomContext {
  roomStatus: RoomStatus | null;
  socket: Socket;
}

export const useRoom: () => RoomContext = () => {
  const [socket] = useSocket('ws://localhost:3000', { autoConnect: true });
  const { roomId } = useParams();
  const username = useQuery().get('username');

  const [roomStatus, setRoomStatus] = React.useState<RoomStatus | null>(null);

  React.useEffect(() => {
    socket.on(Messages.ROOM_STATUS, (status: RoomStatus) => {
      setRoomStatus(status);
    });

    socket.emit(Messages.JOIN_ROOM, {
      roomId,
      username,
    });
  }, []);

  return {
    roomStatus,
    socket,
  };
};
