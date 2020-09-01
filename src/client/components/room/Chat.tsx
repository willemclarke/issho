import React from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import { Messages, RoomStatus } from '../../../common/types';
import { Socket } from 'socket.io';
import { ChatMessage } from './ChatMessage';

interface Props {
  roomStatus: RoomStatus;
  socket: Socket;
  username: string;
}

export const Chat = (props: Props) => {
  const { roomStatus, socket, username } = props;

  const [inputValue, setInputValue] = React.useState('');

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

  const chatMessages = _.map(roomStatus.chatState.messages, (message, index) => {
    return (
      <li key={index}>
        <ChatMessage message={message} />
      </li>
    );
  });

  return (
    <div style={{ backgroundColor: '#F0F0F0' }}>
      <div style={{ height: '615px', padding: '10px', listStyleType: 'none', overflowY: 'auto' }}>
        {chatMessages}
      </div>
      <div style={{ width: '100%' }}>
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
          onPressEnter={(e) => {
            handleSendMessage((e.target as any).value), setInputValue('');
          }}
        />
      </div>
    </div>
  );
};
