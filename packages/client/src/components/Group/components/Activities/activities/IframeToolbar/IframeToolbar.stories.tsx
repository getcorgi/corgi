import { noop } from 'lib/constants';
import { backgroundColor } from 'lib/theme';
import React from 'react';

import { ActivityId } from '../../lib/useActivities';
import { IframeToolbar } from './IframeToolbar';

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
      <IframeToolbar
        activityId={ActivityId.SharedIframe}
        value="http://corgi.chat"
        setValue={noop}
        onSubmit={noop}
        onClickRefresh={noop}
        placeholder="hello!"
      />
    </Container>
  );
};
