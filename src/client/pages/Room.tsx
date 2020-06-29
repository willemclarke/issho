import React from 'react';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io';
import { useQuery } from '../hooks/useQuery';
import { RoomStatus, Messages } from '../../common/types';
import { Result } from 'antd';

interface Props {
  socket: Socket;
}

export const Room = (props: Props) => {
  const { socket } = props;
  const { roomId } = useParams();
  const username = useQuery().get('username');

  const [roomStatus, setRoomStatus] = React.useState<RoomStatus | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    socket.emit(Messages.JOIN_ROOM, {
      roomId,
      username,
    });
  }, []);

  socket.on(Messages.ROOM_STATUS, (status) => {
    console.log(status, 'here here herre');
    setRoomStatus(status);
  });

  socket.on(Messages.JOIN_ROOM_ERROR, (error) => {
    console.log(error);
    setError(error.message);
  });

  if (error) {
    return <Result status="error" title={error} />;
  }

  return (
    <div>
      Room status:
      <pre>{JSON.stringify(roomStatus, null, 2)}</pre>
    </div>
  );
};
