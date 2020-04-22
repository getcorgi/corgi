import { Avatar as MuiAvatar, Box, Card, Color } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const Controls = styled(Box)({
  position: 'absolute',
  display: 'flex',
  bottom: 0,
  justifyContent: 'space-between',
  width: '100%',
  padding: '4px',
});

export const VideoCard = styled(Card)({
  position: 'relative',
  borderRadius: '8px',
});

export const Gradient = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '80px',
  bottom: 0,
});

export const Avatar = styled(MuiAvatar)({
  backgroundColor: ({ userColor }: { userColor?: Color }) => userColor?.[300],
});
