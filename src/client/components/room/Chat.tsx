import React from 'react';
import _, { truncate } from 'lodash';
import { Input } from 'antd';
import { Messages, RoomStatus } from '../../../common/types';
import { Socket } from 'socket.io';
import { useTimeoutFn } from 'react-use';

interface Props {
  roomStatus: RoomStatus;
  socket: Socket;
  username: string;
}

export const Chat = (props: Props) => {
  const { roomStatus, socket, username } = props;
  console.log('chat.tsx roomStatus: ', roomStatus);

  const handleSendMessage = (text: string) => {
    socket.emit(Messages.SEND_MESSAGE_REQUEST, {
      roomId: roomStatus?.roomId,
      username: username,
      text: text,
    });
  };

  const handleMessageTyping = _.debounce(() => {
    socket.emit(Messages.START_TYPING_REQUEST, {
      roomId: roomStatus.roomId,
      username: username,
    });
  }, 400);

  React.useEffect(() => {
    socket.on(Messages.START_TYPING_REQUEST, (msg) => {
      console.log('msg', msg);
      // setRoomStatus(status);
    });
  }, []);

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
          allowClear={true}
          onChange={(e) => handleMessageTyping()}
          onPressEnter={(e) => handleSendMessage((e.target as any).value)}
        />
      </div>
    </div>
  );
};
