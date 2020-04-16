import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const Controls = styled('div')({
  alignItems: 'center',
  pointerEvents: 'none',
  bottom: 0,
  display: 'flex',
  justifyContent: 'space-between',
  height: '96px',
  padding: '8px',
  width: '100%',
  position: 'absolute',
  transition: 'transform 0.2s',
  transform: ({ isIdle }: { isIdle: boolean }) =>
    `translateY(${isIdle ? '96px' : 0})`,
  backgroundImage:
    '-webkit-linear-gradient(bottom,rgba(0,0,0,0.7) 0,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0) 100%)',
});

export const ActionWrapper = styled(Box)({
  pointerEvents: 'all',
});
