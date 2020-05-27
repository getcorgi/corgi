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

export const Preview = styled(Box)({
  '&::before': {
    content: '""',
    backgroundImage: `url("${process.env.PUBLIC_URL}/inspiration-geometry.png")`,
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    opacity: 0.2,
    backgroundSize: '500px',
    pointerEvents: 'none',
  },
});
