import React from 'react';
import _ from 'lodash';
import { Input } from 'antd';
import { useLocationQuery } from '../../../client/hooks/useQuery';
import { Messages, RoomStatus } from '../../../common/types';
import { Socket } from 'socket.io';

interface Props {
  roomStatus: RoomStatus | null;
  socket: Socket;
}

export const Chat = (props: Props) => {
  const { roomStatus, socket } = props;
  console.log('chat.tsx roomStatus: ', roomStatus);

  const username = useLocationQuery().get('username');
  const [message, setMessage] = React.useState<{ message: string; isTyping: boolean }>({
    message: '',
    isTyping: false,
  });

  const handleSendMessage = () => {
    socket.emit(Messages.ADD_MESSAGE_REQUEST, {
      roomId: roomStatus?.roomId,
      username: username,
      message: message.message,
    });
  };

  // Sets both the message value & isTyping flag -> figure out a better function name
  const handleMessageTyping = _.debounce((e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage({ message: e.target.value, isTyping: true });

    if (message.isTyping) {
      socket.emit(Messages.ADD_TYPING_REQUEST, {
        roomId: roomStatus?.roomId,
        isTyping: message.isTyping,
        username: username,
      });
    }
  }, 400);

  const chatMessages = _.map(roomStatus?.chatState, (message, index) => {
    if (!message.isTyping) {
      return (
        <li key={index}>
          <h4>
            {message.username}: {message.message}
          </h4>
        </li>
      );
    } else {
      return (
        <li key={index}>
          <h4>{message.username}: is typing...</h4>
        </li>
      );
    }
  });

  return (
    <div style={{ width: '100%' }}>
      <div className="chat-page" style={{ width: '100%' }}>
        <div className="chatArea">
          <ul className="messages" style={{ listStyleType: 'none' }}>
            {chatMessages}
          </ul>
        </div>
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          onChange={(e) => {
            e.persist(), handleMessageTyping(e);
          }}
          onPressEnter={() => handleSendMessage()}
        />
      </div>
    </div>
  );
};
