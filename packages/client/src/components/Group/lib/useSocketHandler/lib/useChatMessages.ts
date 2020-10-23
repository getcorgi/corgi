import { isChatDrawerOpenState } from 'components/Group/components/Sidebar/Sidebar';
import { currentUserState } from 'lib/hooks/useUser';
import { useCallback, useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

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
  const isChatDrawerOpen = useRecoilValue(isChatDrawerOpenState);
  const me = useRecoilValue(currentUserState);
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
      if (
        !isChatDrawerOpen &&
        message.user.firebaseAuthId !== me.firebaseAuthId
      ) {
        setUnreadMessageCount(count => count + 1);
      }

      setMessages(oldMessages => {
        return [...oldMessages, message];
      });
    });

    return function cleanup() {
      socket.removeEventListener('receivedChatMessage');
    };
  }, [isChatDrawerOpen, me, me.id, socket]);

  return {
    messages,
    sendMessage,
    setUnreadMessageCount,
    unreadMessageCount,
  };
}
