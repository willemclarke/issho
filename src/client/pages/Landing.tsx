import React from 'react';
import useSocket from 'use-socket.io-client';
import { Alert, Button, Col, Form, Input, Row, Typography } from 'antd';
import { useHistory } from 'react-router';
import { Messages } from '../../common/types';
import { useAppContext } from '../hooks/useAppContext';

const { Title } = Typography;

export const Landing = () => {
  const { config } = useAppContext();
  const [socket] = useSocket(config.webSocketApi, {
    autoConnect: true,
    secure: config.webSocketSecure,
  });
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

  const duplicateUserError = error ? <Alert message={error} type="error" banner /> : null;

  return (
    <Row justify="center" style={{ marginTop: '2rem' }}>
      <Col xs={4} xxl={5}>
        <Form name="landing" className="landing-form" onFinish={onSubmit}>
          <Form.Item name="roomId" rules={[{ required: true, message: 'Please enter room name' }]}>
            <Input
              type="roomId"
              placeholder="Enter room name"
              onChange={(e) => setRoomId(e.target.value)}
            />
          </Form.Item>
          <Form.Item name="username" rules={[{ required: true, message: 'Please enter username' }]}>
            <Input
              placeholder="Enter username"
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
          </Form.Item>
          {duplicateUserError}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              style={{ width: '100%' }}
            >
              Join Room
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};
