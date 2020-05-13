import { useCallback, useContext, useEffect, useState } from 'react';

import { MeContext } from '../../../../MeProvider';
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
  const { me } = useContext(MeContext);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);

  const sendMessage = useCallback(
    (msg: string) => {
      socket.emit('sendChatMessage', { msg });
    },
    [socket],
  );

  useEffect(() => {
    socket.on('receivedChatMessage', (message: Message) => {
      if (message.user.firebaseAuthId !== me.firebaseAuthId) {
        setUnreadMessageCount(count => count + 1);
      }

      setMessages(oldMessages => {
        return [...oldMessages, message];
      });
    });

    return function cleanup() {
      socket.removeEventListener('receivedChatMessage');
    };
  }, [me, me.id, socket]);

  return {
    messages,
    sendMessage,
    setUnreadMessageCount,
    unreadMessageCount,
  };
}
