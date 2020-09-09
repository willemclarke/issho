import React from 'react';
import moment from 'moment';
import { Message, MessageType } from '../../../common/types';

interface Props {
  message: Message;
}

export const ChatMessage = (props: Props) => {
  const { message } = props;

  const relativeTime = moment(message.timestamp).format('HH:mm');
  const renderedMessage = () => {
    switch (message.type) {
      case MessageType.CHAT:
        return `${message.username}: ${message.text}`;
      case MessageType.ROOM:
        return `${message.text}`;
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <h4>{renderedMessage()}</h4>
      <h6 style={{ paddingLeft: '5px' }}>({relativeTime})</h6>
    </div>
  );
};
