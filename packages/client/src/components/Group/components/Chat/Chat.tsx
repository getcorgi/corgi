import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';

import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import * as S from './Chat.styles';

interface Props {
  messages: Message[];
  sendMessage: (msg: string) => void;
  shouldFocusInput: boolean;
}

const SCROLLED_TO_BOTTOM_THRESHOLD = 100;

const ChatMessage = (props: { message: Message }) => {
  return (
    <S.ChatMessage>
      <div>
        <S.ChatMessageUser userColor={props.message.user.color}>
          {props.message.user.name}
        </S.ChatMessageUser>
        <S.ChatMessageTime>
          {moment(props.message.createdAt).fromNow()}
        </S.ChatMessageTime>
      </div>
      <S.ChatMessageMessage>{props.message.message}</S.ChatMessageMessage>
    </S.ChatMessage>
  );
};

export default function Chat(props: Props) {
  const [newChatMessage, setNewChatMessage] = useState('');
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    const messages = messagesRef?.current;
    if (messages) {
      messages.scrollTop = messages.scrollHeight;
    }
  };

  useEffect(() => {
    const scrollHeight = messagesRef?.current?.scrollHeight;
    const messages = messagesRef?.current;

    if (messages && scrollHeight) {
      const isScrolledToBottom =
        messages?.scrollTop >=
        scrollHeight - (messages?.offsetHeight + SCROLLED_TO_BOTTOM_THRESHOLD);

      if (isScrolledToBottom) {
        scrollToBottom();
      }
    }
  }, [props.messages.length]);

  useEffect(() => {
    if (inputRef.current !== document.activeElement && props.shouldFocusInput) {
      inputRef.current?.focus();
    }
  }, [props.shouldFocusInput]);

  const submitChatMessage = (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newChatMessage) return;

    props.sendMessage(newChatMessage);
    setNewChatMessage('');
    scrollToBottom();
  };

  const onChatMessageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewChatMessage(e.target.value);
  };

  return (
    <S.Chat>
      <S.ChatMessages ref={messagesRef}>
        {props.messages.map(message => {
          return <ChatMessage message={message} key={message.createdAt} />;
        })}
      </S.ChatMessages>
      <S.ChatInputForm>
        <form onSubmit={submitChatMessage}>
          <S.ChatInput
            ref={inputRef}
            value={newChatMessage}
            onChange={onChatMessageChange}
          />
        </form>
      </S.ChatInputForm>
    </S.Chat>
  );
}
