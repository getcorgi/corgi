import { Avatar, Box, styled } from '@material-ui/core';

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

export const UserAvatar = styled(Avatar)({
  width: ({ size }: { size: number }) => `${size}px`,
  height: ({ size }: { size: number }) => `${size}px`,
  fontSize: ({ size }: { size: number }) => `${size / 2}px`,
});

export const Video = styled('div')({
  position: 'relative',
  overflow: 'hidden',
  width: '100%',
  height: '100%',
  paddingBottom: '25%',
});

export const EmptyVideo = styled(Box)({
  position: 'absolute',
  backgroundColor: '#16161d8a',
});
