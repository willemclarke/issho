import React from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io';
import { useQuery } from '../hooks/useQuery';
import { RoomStatus, Messages } from '../../common/types';

interface Props {
  socket: Socket;
}

export const Room = (props: Props) => {
  const { socket } = props;
  console.log(socket, 'socket log, room.tsx');
  const { roomId } = useParams();
  console.log(roomId, 'useParams, Room.tsx log');
  const username = useQuery().get('username');

  const [roomStatus, setRoomStatus] = React.useState<RoomStatus | null>(null);

  React.useEffect(() => {
    socket.emit(Messages.JOIN_ROOM, {
      roomId,
      username,
    });
  }, []);

  socket.on(Messages.ROOM_STATUS, (status) => {
    setRoomStatus(status);
  });

  return (
    <div>
      <pre>{JSON.stringify(roomStatus, null, 2)}</pre>
    </div>
  );
};
