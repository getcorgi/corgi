import { useCallback, useEffect, useState } from 'react';

import { User } from '../types';

export interface Message {
  message: string;
  user: User;
  createdAt: number;
}

export default function useChatMessages({
  socket,
}: {
  socket: SocketIOClient.Socket;
}) {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(
    (msg: string) => {
      socket.emit('sendChatMessage', { msg });
    },
    [socket],
  );

  useEffect(() => {
    socket.on('receivedChatMessage', (message: Message) => {
      setMessages(oldMessages => {
        return [...oldMessages, message];
      });
    });

    return function cleanup() {
      socket.removeEventListener('receivedChatMessage');
    };
  }, [socket]);

  return {
    messages,
    sendMessage,
  };
}
