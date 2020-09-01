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
  const [typingMessages, setTypingMessages] = React.useState<string[]>([]);

  // when received on the server, forward to all users
  // when u recieve payload (roomId & username): add that username to a state
  // store an array of usernames inside the state [badger, dbou, bass] etc
  // create function which _.delay remove latest user from the state array
  // iterate over array and render their username + 'is typing..'
  // Note: change typingMessages state name and revise typingChatMessage()
  // Note: becomes very laggy, I speculate its due to _.uniq being called for every time a key is pressed

  React.useEffect(() => {
    socket.on(Messages.START_TYPING_REQUEST, (msg) => {
      setTypingMessages([msg.username]);
      _.uniq(typingMessages);
      _.delay(() => setTypingMessages([]), 1500);
    });
  }, [typingMessages]);

  const handleMessageTyping = _.debounce(() => {
    socket.emit(Messages.START_TYPING_REQUEST, {
      roomId: roomStatus.roomId,
      username: username,
    });
  }, 600);

  const handleSendMessage = (text: string) => {
    socket.emit(Messages.SEND_MESSAGE_REQUEST, {
      roomId: roomStatus?.roomId,
      username: username,
      text: text,
    });
  };

  const typingChatMessage = _.map(typingMessages, (username, index) => {
    return (
      <span key={index}>
        <h5>{username} is typing</h5>
      </span>
    );
  });

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
        {typingChatMessage}
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          onChange={(e) => {
            setInputValue(e.target.value), handleMessageTyping();
          }}
          value={inputValue}
          onPressEnter={(e) => {
            handleSendMessage((e.target as any).value), setInputValue('');
          }}
        />
      </div>
    </div>
  );
};
