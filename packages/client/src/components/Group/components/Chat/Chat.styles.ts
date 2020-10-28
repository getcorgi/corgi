import { styled } from '@material-ui/core';
import theme, { backgroundColor } from 'lib/theme';

import { User } from '../../lib/useSocketHandler';

export const ChatMessages = styled('div')({
  overflowY: 'auto',
});

export const ChatInputForm = styled('div')({
  position: 'relative',
});

export const ChatInput = styled('textarea')({
  width: '100%',
  fontSize: '16px',
  fontFamily: `${theme.typography.fontFamily}`,
  padding: '12px',
  lineHeight: 1,
  borderRadius: '4px',
  background: backgroundColor[700],
  color: 'white',
  border: '1px solid transparent',
  '&:focus': {
    outline: 'none',
    boxShadow: '0 0 0 4px #6a6abf1f',
    border: `1px solid ${theme.palette.primary.main}`,
  },
});

export const Chat = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  justifyContent: 'flex-end',
  padding: '16px',
});

export const ChatMessage = styled('div')({
  marginBottom: '16px',
});

export const ChatMessageUser = styled('strong')({
  color: ({ userColor }: { userColor: User['color'] }) =>
    userColor?.['200'] || 'white',
  marginRight: '10px',
});

export const ChatMessageTime = styled('span')({
  fontSize: '12px',
  color: '#565861',
});

export const ChatMessageMessage = styled('p')({
  color: 'white',
  margin: 0,
  fontSize: ({ isLarge }: { isLarge: boolean }) => (isLarge ? '40px' : '16px'),
  whiteSpace: 'normal',
  wordBreak: 'break-word',
});

export const ChatMessageImage = styled('img')({
  maxWidth: '100%',
});

export const EmojiPicker = styled('div')({
  position: 'absolute',
  right: '10px',
  transform: 'translateY(-50%)',
  top: '50%',
});

export const GiphySearch = styled('div')({
  position: 'absolute',
  right: '50px',
  transform: 'translateY(-50%)',
  top: '50%',
});
