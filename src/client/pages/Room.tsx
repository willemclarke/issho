import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io';
import { useQuery } from '../hooks/useQuery';
import { RoomStatus, Messages } from '../../common/types';
import { Spin } from 'antd';
import { UserList } from '../components/room/UserList';

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
    socket.emit(Messages.JOINED_ROOM, {
      roomId,
      username,
    });
  }, []);

  socket.on(Messages.ROOM_STATUS, (status) => {
    console.log(status, 'got a status');
    setRoomStatus(status);
  });

  if (!roomStatus) {
    return <Spin />;
  }
  return (
    <div>
      <h2>Room status:</h2>
      <UserList users={roomStatus.users} />
      {/* <pre>{JSON.stringify(roomStatus, null, 2)}</pre> */}
    </div>
  );
};
