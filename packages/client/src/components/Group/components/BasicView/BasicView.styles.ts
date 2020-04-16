import { Box, Card } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const LocalVideo = styled(Card)({
  position: 'absolute',
  top: '16px',
  right: '16px',
  width: '150px',
  height: '100px',
});

export const EmptyMessage = styled('div')({
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 600,
  fontSize: '30px',
});

export const LinkWrapper = styled(Box)({
  background: '#33325a',
  padding: '2px 10px',
  borderRadius: '8px',
});

export const BasicView = styled(Box)({
  flexFlow: 'wrap-reverse',
});
