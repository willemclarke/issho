import { Col, Row, Spin } from 'antd';
import React from 'react';
import { UserList } from '../components/room/UserList';
import { VideoPlayer } from '../components/room/VideoPlayer';
import { useRoom } from '../hooks/useRoom';

interface Props {}

export const Room = (props: Props) => {
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
