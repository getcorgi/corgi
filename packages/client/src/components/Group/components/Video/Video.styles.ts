import { styled } from '@material-ui/core';

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
