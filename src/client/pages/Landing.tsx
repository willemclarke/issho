import React from 'react';
import { useHistory } from 'react-router';
import { Button, Input, Form, Row, Col, Typography } from 'antd';

const { Title } = Typography;

export const Landing = () => {
  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const history = useHistory();

  const onJoin = () => {
    history.push(`/rooms/${roomId}?username=${username}`);
  };

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
          <Form onFinish={onJoin}>
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
