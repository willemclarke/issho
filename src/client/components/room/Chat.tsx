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
  // const [usersTyping, setUsersTyping] = React.useState<{ [key: string]: number }>({});

  const handleSendMessage = (text: string) => {
    socket.emit(Messages.SEND_MESSAGE_REQUEST, {
      roomId: roomStatus?.roomId,
      username: username,
      text: text,
    });
  };

  const chatMessages = _.map(roomStatus.chatState.messages, (message, index) => {
    return (
      <li key={index}>
        <ChatMessage message={message} />
      </li>
    );
  });

  // when received on the server, forward to all users
  // when u recieve payload (roomId & username): add that username to a state
  // store an array of usernames inside the state [badger, dbou, bass] etc
  // create function which _.delay remove latest user from the state array

  // React.useEffect(() => {
  //   socket.on(Messages.START_TYPING_REQUEST, (msg) => {
  //     console.log('users typing', usersTyping);
  //     setUsersTyping({
  //       ...usersTyping,
  //       [msg.username]: setTimeout(() => {
  //         console.log('clear timeout: ');
  //         clearTimeout(usersTyping[msg.username]);
  //       }, 2000),
  //     });
  //   });
  // }, []);

  // const handleMessageTyping = _.debounce(() => {
  //   socket.emit(Messages.START_TYPING_REQUEST, {
  //     roomId: roomStatus.roomId,
  //     username: username,
  //   });
  // }, 600);

  // const typingChatMessage = _.map(usersTyping, (username, index) => {
  //   // add if check based off state[].length if > 1 render whole array + is typing
  //   // else render username + is typing
  //   return (
  //     <span key={index}>
  //       <h5>{username} is typing</h5>
  //     </span>
  //   );
  // });

  return (
    <div style={{ backgroundColor: '#F0F0F0' }}>
      <div style={{ height: '615px', padding: '10px', listStyleType: 'none', overflowY: 'auto' }}>
        {chatMessages}
      </div>
      {/* <div style={{ minHeight: '30px' }}>{typingChatMessage}</div> */}
      <div style={{ width: '100%' }}>
        <Input
          className="inputMessage"
          type="roomId"
          placeholder="Type message here"
          onChange={(e) => {
            setInputValue(e.target.value);
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
