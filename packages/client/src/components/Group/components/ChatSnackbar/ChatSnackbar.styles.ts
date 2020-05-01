import { styled, Typography } from '@material-ui/core';
import { User } from '../../lib/useSocketHandler';
import { grey } from '@material-ui/core/colors';
import { Snackbar } from '@material-ui/core';
import { CLOSED_DRAWER_WIDTH } from '../Sidebar/Sidebar.styles';

export const ChatMessageUser = styled('strong')({
  color: ({ userColor }: { userColor: User['color'] }) =>
    userColor?.['600'] || 'black',
  marginRight: '10px',
});

export const ChatMessageMessage = styled(Typography)({
  color: grey[700],
  margin: 0,
  fontSize: '16px',
  maxWidth: 255,
});

export const ChatSnackbar = styled(Snackbar)({
  right: `${CLOSED_DRAWER_WIDTH + 24}px`,
  cursor: 'pointer',
});
