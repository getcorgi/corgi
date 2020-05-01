import React, { useEffect, useState } from 'react';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';

import * as S from './ChatSnackbar.styles';

export interface SnackbarMessage {
  message: string;
  key: number;
}

interface Props {
  sholdShowSnackbar: boolean;
  messages: Message[];
  handleOpenChatWindow: () => void;
}

export default function ChatSnackbar(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  const handleClose = (
    event: React.SyntheticEvent | MouseEvent,
    reason?: string,
  ) => {
    if (reason === 'clickaway') {
      return;
    }
    setIsOpen(false);
  };

  const onClickSnackbar = () => {
    setIsOpen(false);
    props.handleOpenChatWindow();
  };

  useEffect(() => {
    if (props.sholdShowSnackbar && props.messages.length) {
      const latestMessage = props.messages[props.messages.length - 1];

      if (latestMessage.createdAt > new Date().getTime() - 1000) {
        setIsOpen(true);
      }
    }
  }, [props.messages, props.sholdShowSnackbar]);

  if (!props.sholdShowSnackbar || !props.messages.length) return null;

  const latestMessage = props.messages[props.messages.length - 1];

  return (
    <S.ChatSnackbar
      key={latestMessage.createdAt}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={isOpen}
      autoHideDuration={3500}
      onClose={handleClose}
      onClick={onClickSnackbar}
      message={
        <>
          <S.ChatMessageUser userColor={latestMessage.user.color}>
            {latestMessage.user.name}
          </S.ChatMessageUser>
          <S.ChatMessageMessage noWrap={true}>
            {latestMessage.message}
          </S.ChatMessageMessage>
        </>
      }
    />
  );
}
