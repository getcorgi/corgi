import { Box } from '@material-ui/core';
import { Meta } from '@storybook/react';
import * as React from 'react';

import DraggableSplitWrapper from './DraggableSplitWrapper';

export default {
  title: 'DraggableSplitWrapper',
} as Meta;

export const Default = () => (
  <Box width="1000px" height="500px">
    <DraggableSplitWrapper
      draggerColor="blue"
      left={<Box>hi</Box>}
      right={<Box>hi</Box>}
    />
  </Box>
);
