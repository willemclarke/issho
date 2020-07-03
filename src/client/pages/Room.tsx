import React from 'react';
import _ from 'lodash';
import { useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { Row, Col, Spin } from 'antd';
import { Socket } from 'socket.io';
import { useLocationQuery } from '../hooks/useQuery';
import { RoomStatus, Messages } from '../../common/types';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { youtubeSearch } from '../api/api';

interface Props {
  socket: Socket;
}

export const Room = (props: Props) => {
  const { socket } = props;
  const { roomId } = useParams();
  const username = useLocationQuery().get('username');

  const [roomStatus, setRoomStatus] = React.useState<RoomStatus | null>(null);

  const { isFetching, data, error } = useQuery('youtubeKey', () => {
    return youtubeSearch('', 'searchTerm');
  });

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
