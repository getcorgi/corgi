import { useCallback, useContext, useEffect, useState } from 'react';
import useSound from 'use-sound';

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
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);
  const [chatReceivedBoop] = useSound(
    `${process.env.PUBLIC_URL}/chatSound.mp3`,
    { volume: 0.25 },
  );

  const sendMessage = useCallback(
    (msg: string) => {
      socket.emit('sendChatMessage', { msg });
    },
    [socket],
  );

  useEffect(() => {
    socket.on('receivedChatMessage', (message: Message) => {
      if (message.user.firebaseAuthId !== me.firebaseAuthId) {
        setHasUnreadMessages(true);
        chatReceivedBoop({});
      }

      setMessages(oldMessages => {
        return [...oldMessages, message];
      });
    });

    return function cleanup() {
      socket.removeEventListener('receivedChatMessage');
    };
  }, [chatReceivedBoop, me, me.id, socket]);

  return {
    messages,
    sendMessage,
    hasUnreadMessages,
    setHasUnreadMessages,
  };
}
