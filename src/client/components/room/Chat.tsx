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
  console.log('roomStatus, chat.tsx ', roomStatus);

  const username = useLocationQuery().get('username');
  const [message, setMessage] = React.useState<string>('');

  const handleSendMessage = () => {
    socket.emit(Messages.ADD_MESSAGE_REQUEST, { roomId: roomStatus?.roomId, username, message });
  };

  const handleMessageTyping = () => {};

  const chatMessages = _.map(roomStatus?.chatState, (message, index) => (
    <li key={index}>
      {message.username}: {message.message}
    </li>
  ));

  return (
    <div>
      <div className="chat-page">
        <div className="chatArea">
          <ul className="messages" style={{ listStyleType: 'none' }}>
            {chatMessages}
          </ul>
        </div>
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          onChange={(e) => setMessage(e.target.value)}
          onPressEnter={() => handleSendMessage()}
        />
      </div>
    </div>
  );
};
