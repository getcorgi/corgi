import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../../../constants';

export const Streams = styled(Box)({
  backgroundColor: backgroundColor['800'],
  maxHeight: '100%',
  overflow: 'auto',
});
