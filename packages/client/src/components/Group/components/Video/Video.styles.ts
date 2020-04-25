import { Avatar, Box, Color, styled } from '@material-ui/core';

export const AudioIndicator = styled('div')({
  width: '28px',
  marginRight: '4px',
  display: 'flex',
  justifyContent: 'center',
});

export const Information = styled('div')({
  position: 'absolute',
  left: '0',
  display: 'flex',
  alignItems: 'center',
  bottom: '0',
  padding: '8px',
  height: '32px',
  width: '100%',
  backgroundImage:
    '-webkit-linear-gradient(bottom,rgba(0,0,0,0.7) 0,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0) 100%)',
});

interface AvatarProps {
  size: number;
  userColor?: Color;
}

export const UserAvatar = styled(Avatar)({
  width: ({ size }: AvatarProps) => `${size}px`,
  height: ({ size }: AvatarProps) => `${size}px`,
  fontSize: ({ size }: AvatarProps) => `${size / 2}px`,
  backgroundColor: ({ userColor }: AvatarProps) => userColor?.[300],
});

export const Video = styled('div')({
  position: 'absolute',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
});

export const EmptyVideo = styled(Box)({
  position: 'absolute',
  backgroundColor: '#00000070',
});
