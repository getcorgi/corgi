import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../../../lib/theme';

export const Streams = styled(Box)({
  backgroundColor: backgroundColor['800'],
  height: '100%',
  overflow: 'auto',
  position: 'relative',
});
