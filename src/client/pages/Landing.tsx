import React from 'react';
import { Socket } from 'socket.io';
import useSocket from 'use-socket.io-client';
import { useHistory } from 'react-router';
import { Alert, Button, Col, Form, Input, Row, Typography } from 'antd';
import { Messages } from '../../common/types';

const { Title } = Typography;

export const Landing = () => {
  const [socket] = useSocket(location.origin.replace(/^http/, 'ws'), { autoConnect: true });
  const history = useHistory();

  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    socket.on(Messages.CAN_JOIN_ROOM_RESPONSE, (data: any) => {
      if (data.error) {
        setError(data.error);
      } else {
        history.push(`/rooms/${data.roomId}?username=${data.username}`);
      }
    });
  }, [history, socket]);

  const onSubmit = () => {
    socket.emit(Messages.CAN_JOIN_ROOM_REQUEST, { roomId, username });
  };

  const displayError = error ? <Alert message={error} type="error" banner /> : null;

  return (
    <Row justify="center" style={{ marginTop: '2rem' }}>
      <Col
        xs={4}
        xxl={5}
        style={{
          color: 'white',
          backgroundColor: '#121212',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: '15px',
        }}
      >
        <div style={{ width: '90%', textAlign: 'center' }}>
          {displayError}
          <Form onFinish={onSubmit}>
            <Title level={3} style={{ color: 'white' }}>
              Enter username
            </Title>
            <Form.Item
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
            >
              <Input
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
                }}
              />
            </Form.Item>
            <Title level={3} style={{ color: 'white' }}>
              Enter room-name
            </Title>
            <Form.Item
              name="roomId"
              rules={[{ required: true, message: 'Please input a Room ID' }]}
            >
              <Input
                type="roomId"
                placeholder="Room Name"
                onChange={(e) => setRoomId(e.target.value)}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Join
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Col>
    </Row>
  );
};
