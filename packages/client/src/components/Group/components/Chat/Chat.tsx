import { IconButton } from '@material-ui/core';
import SendIcon from '@material-ui/icons/Send';
import moment from 'moment';
import React, { useState } from 'react';

import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';

interface Props {
  messages: Message[];
  sendMessage: (msg: string) => void;
}

const ChatMessage = (props: { message: Message }) => {
  return (
    <div>
      <div>
        <strong>{props.message.user.name}</strong>
        <span>{moment(props.message.createdAt).fromNow()}</span>
      </div>
      <div>{props.message.message}</div>
    </div>
  );
};

export default function Chat(props: Props) {
  const [newChatMessage, setNewChatMessage] = useState('');

  const submitChatMessage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newChatMessage) return;

    props.sendMessage(newChatMessage);
    setNewChatMessage('');
  };

  const onChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(e.target.value);
  };

  return (
    <div>
      {props.messages.map(message => {
        return <ChatMessage message={message} key={message.createdAt} />;
      })}

      <div>
        <form onSubmit={submitChatMessage}>
          <input value={newChatMessage} onChange={onChatMessageChange} />
        </form>
      </div>
    </div>
  );
}
