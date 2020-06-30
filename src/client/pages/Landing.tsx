import React from 'react';
import { useHistory } from 'react-router';
import { Button, Input, Form, Row, Col, Typography, Alert, Result } from 'antd';
import { Socket } from 'socket.io';
import { Messages } from '../../common/types';

interface Props {
  socket: Socket;
}

const { Title } = Typography;

export const Landing = (props: Props) => {
  const { socket } = props;

  const history = useHistory();

  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const onSubmit = () => {
    socket.emit(Messages.JOIN_ROOM, {
      roomId,
      username,
    });
  };

  socket.on(Messages.VALIDATED_JOIN_ROOM, () => {
    history.push(`/rooms/${roomId}?username=${username}`);
  });

  socket.on(Messages.INVALID_JOIN_ROOM, (error) => {
    setError(error.errorMessage);
  });

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
            <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
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
            <Form.Item name="roomId" rules={[{ required: true, message: 'Please input a Room ID' }]}>
              <Input type="roomId" placeholder="Room Name" onChange={(e) => setRoomId(e.target.value)} />
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
