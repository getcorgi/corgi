import React from 'react';

import { noop } from '../../constants';
import Board from './Board';

export default {
  title: 'Board',
};

export const Default = () => (
  <Board
    name="Great Red Board... argh"
    start={noop}
    call={noop}
    hangup={noop}
  />
);
