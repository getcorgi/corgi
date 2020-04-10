import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../../../constants';

export const Label = styled('div')({
  position: 'absolute',
  top: 0,
  right: 0,
  padding: '4px',
  background: 'rgba(0, 0, 0, 0.5)',
});

export const Streams = styled(Box)({
  backgroundColor: backgroundColor['800'],
});
