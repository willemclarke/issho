import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { Socket } from 'socket.io';
import { useQuery } from '../hooks/useQuery';
import { Row, Col, Spin } from 'antd';
import { RoomStatus, Messages } from '../../common/types';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';

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
    setRoomStatus(status);
  });

  if (!roomStatus) {
    return <Spin />;
  }

  return (
    <Row style={{ height: '100%' }}>
      <Col span={18} style={{ backgroundColor: '#ededed', padding: '10px' }}>
        <VideoPlayer socket={socket} roomId={roomId} />
        <UserList users={roomStatus.users} />
      </Col>
      <Col span={6} style={{ backgroundColor: '#ffffff' }}></Col>
    </Row>
  );
};
