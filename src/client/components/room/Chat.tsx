import React from 'react';
import _ from 'lodash';
import { Input, Space, Dropdown, Menu, Button } from 'antd';
import { Messages, RoomStatus } from '../../../common/types';
import { Socket } from 'socket.io';
import { HeartOutlined } from '@ant-design/icons';

interface Props {
  roomStatus: RoomStatus;
  socket: Socket;
  username: string;
}

export const Chat = (props: Props) => {
  const { roomStatus, socket, username } = props;

  const handleSendMessage = (text: string) => {
    socket.emit(Messages.SEND_MESSAGE_REQUEST, {
      roomId: roomStatus?.roomId,
      username: username,
      text: text,
    });
  };

  // Note: handleMessageTyping useEffect currently does nothing - taking a break
  const handleMessageTyping = _.debounce(() => {
    socket.emit(Messages.START_TYPING_REQUEST, {
      roomId: roomStatus.roomId,
      username: username,
    });
  }, 400);

  React.useEffect(() => {
    socket.on(Messages.START_TYPING_REQUEST, (msg) => {
      console.log('msg', msg);
    });
  }, []);

  const connectedUsers = _.map(roomStatus.users, (user, index) => {
    return (
      <li key={user.username}>
        <Space style={{ margin: '0px' }}>
          <h4>{user.username} joined</h4> <HeartOutlined style={{ color: '#121212' }} />
        </Space>
      </li>
    );
  });

  const usersForDropdownMenu = _.map(roomStatus.users, (user, index) => {
    return (
      <Menu.Item>
        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
          {user.username}
        </a>
      </Menu.Item>
    );
  });

  const dropDownConnectedUsers = <Menu>{usersForDropdownMenu}</Menu>;

  const chatMessages = _.map(roomStatus.chatState.messages, (message, index) => {
    return (
      <li key={index}>
        <h4>
          {message.username}: {message.text}
        </h4>
      </li>
    );
  });

  return (
    <div style={{ backgroundColor: '#F0F0F0' }}>
      <Dropdown overlay={dropDownConnectedUsers} placement="bottomCenter">
        <Button style={{ width: '100%' }}>Connected Users</Button>
      </Dropdown>
      <div style={{ height: '615px', padding: '10px', listStyleType: 'none', overflowY: 'auto' }}>
        {chatMessages}
      </div>
      <div style={{ width: '100%' }}>
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          allowClear={true}
          onChange={(e) => handleMessageTyping()}
          onPressEnter={(e) => handleSendMessage((e.target as any).value)}
        />
      </div>
    </div>
  );
};
