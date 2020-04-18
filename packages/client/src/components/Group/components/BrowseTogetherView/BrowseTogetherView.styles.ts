import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../../../lib/theme';

const DRAGGER_SIZE = '5px';

export const Streams = styled(Box)({
  backgroundColor: backgroundColor['800'],
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative',
  paddingLeft: DRAGGER_SIZE,
});

export const Dragger = styled('div')({
  width: DRAGGER_SIZE,
  cursor: 'col-resize',
  position: 'absolute',
  top: 0,
  left: 0,
  bottom: 0,
  backgroundColor: 'rgba(255,255,255, 0.1)',
});
