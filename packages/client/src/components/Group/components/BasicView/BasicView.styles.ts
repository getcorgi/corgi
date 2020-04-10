import { Card } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const Label = styled('div')({
  position: 'absolute',
  top: 0,
  left: 0,
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.5)',
});

export const LocalVideo = styled(Card)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '150px',
  height: '100px',
});

export const EmptyMessage = styled('div')({
  color: 'rgba(255, 255, 255, 0.14)',
  fontWeight: 600,
  fontSize: '30px',
});
