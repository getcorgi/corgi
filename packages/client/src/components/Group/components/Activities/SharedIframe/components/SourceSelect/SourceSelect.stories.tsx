import React from 'react';

import { noop } from '../../../../../../../constants';
import { backgroundColor } from '../../../../../../../lib/theme';
import { SourceSelect } from './SourceSelect';

export default {
  title: 'SourceSelect',
};

const Container = (props: { children: React.ReactNode }) => (
  <div
    style={{
      height: '100vh',
      width: '100%',
      background: backgroundColor['800'],
    }}
  >
    {props.children}
  </div>
);

export const Default = () => {
  return (
    <Container>
      <SourceSelect
        activityUrl="http://corgi.chat"
        setActivityUrl={noop}
        onSubmit={noop}
        updateActivityUrl={noop}
      />
    </Container>
  );
};
