import React from 'react';
import { Button, Input, Form } from 'antd';
import { useHistory } from 'react-router';

export const Landing = () => {
  const [username, setUsername] = React.useState('');
  const [roomId, setRoomId] = React.useState('');
  const history = useHistory();

  const onJoin = () => {
    history.push(`/rooms/${roomId}?username=${username}`);
  };

  return (
    <Form onFinish={onJoin}>
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
      <Form.Item name="roomId" rules={[{ required: true, message: 'Please input a Room ID' }]}>
        <Input type="roomId" placeholder="roomId" onChange={(e) => setRoomId(e.target.value)} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Join
        </Button>
      </Form.Item>
    </Form>
  );
};
