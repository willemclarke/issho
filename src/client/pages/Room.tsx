import React from 'react';
import _ from 'lodash';
import { useQuery } from 'react-query';
import { Row, Col, Spin } from 'antd';
import { youtubeSearch } from '../api/api';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { useRoom } from '../hooks/useRoom';

interface Props {}

export const Room = (props: Props) => {
  const { isFetching, data, error } = useQuery('youtubeKey', () => {
    return youtubeSearch('', 'searchTerm');
  });

  const { roomStatus, socket } = useRoom();

  if (!roomStatus) {
    return <Spin />;
  }

  return (
    <Row style={{ height: '100%' }}>
      <Col span={18} style={{ backgroundColor: '#ededed', padding: '10px' }}>
        <VideoPlayer socket={socket} roomId={roomStatus.id} />
        <UserList users={roomStatus.users} />
      </Col>
      <Col span={6} style={{ backgroundColor: '#ffffff' }}></Col>
    </Row>
  );
};
