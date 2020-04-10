import { Card } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

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
