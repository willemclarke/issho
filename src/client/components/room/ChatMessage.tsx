import React from 'react';
import moment from 'moment';
import { Message, MessageType } from '../../../common/types';

interface Props {
  message: Message;
}

export const ChatMessage = (props: Props) => {
  const { message } = props;
  const relativeTime = moment(message.timestamp).format('HH:mm');

  switch (message.type) {
    case MessageType.CHAT: {
      return (
        <>
          <h4>
            {message.username}: {message.text}
          </h4>
        </>
      );
    }
    case MessageType.ROOM: {
      return <h4>{message.text}</h4>;
    }
  }
};
