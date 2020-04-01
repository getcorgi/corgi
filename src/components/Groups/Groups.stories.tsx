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
        name: 'Group A',
      },
      {
        id: '2',
        name: 'Group B',
      },
      {
        id: '3',
        name: 'Group C',
      },
      {
        id: '4',
        name: 'Group D',
      },
    ]}
    onAddGroup={noop}
  />
);
