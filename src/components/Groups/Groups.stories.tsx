import React from 'react';

import { noop } from '../../constants';
import Groups from './Groups';

export default {
  title: 'Groups',
};

export const Default = () => (
  <Groups
    groups={[
      {
        id: '1',
        name: 'Board A',
      },
      {
        id: '2',
        name: 'Board B',
      },
      {
        id: '3',
        name: 'Board C',
      },
      {
        id: '4',
        name: 'Board D',
      },
    ]}
    onAddGroup={noop}
  />
);
