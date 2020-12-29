import { Meta } from '@storybook/react';
import { backgroundColor } from 'lib/theme';
import React, { useState } from 'react';

import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import Chat from './Chat';

export default {
  title: 'Chat',
} as Meta;

const Container = (props: { children: React.ReactNode }) => (
  <div
    style={{
      height: '100vh',
      width: '100%',
      background: backgroundColor['800'],
    }}
  >
    {props.children}
  </div>
);

export const Default = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = (msg: string) => {
    const newMessage = {
      message: msg,
      user: {
        name: 'Bags',
        id: '1',
      },
      createdAt: new Date().getTime(),
    };

    setMessages(messages => {
      return [...messages, newMessage];
    });
  };

  return (
    <Container>
      <Chat
        messages={messages}
        sendMessage={sendMessage}
        shouldFocusInput={true}
      />
    </Container>
  );
};
