import { number } from '@storybook/addon-knobs';
import React from 'react';

import BasicView from './BasicView';

export default {
  title: 'BasicView',
};

const createStream = (id: string) => ({
  [id]: {
    stream: new MediaStream(),
    user: {
      name: `user ${id}`,
      id: id,
    },
  },
});

const createStreams = (count: number) => {
  return [...Array(count)].reduce((acc, _, idx) => {
    return {
      ...acc,
      ...createStream(`${idx + 1}`),
    };
  }, {});
};

const defaultProps = {
  streams: {},
  localStream: new MediaStream(),
  userName: 'user 1',
};

const Container = (props: { children: React.ReactNode }) => (
  <div style={{ height: '100vh', width: '100%', background: 'gray' }}>
    {props.children}
  </div>
);

export const OneUser = () => {
  const streamCount = number('streamCount', 0);

  const streams = createStreams(streamCount);

  return (
    <Container>
      <BasicView {...defaultProps} streams={streams} />
    </Container>
  );
};

export const TwoUsers = () => (
  <Container>
    <BasicView {...defaultProps} streams={createStreams(1)} />
  </Container>
);

export const ThreeUsers = () => (
  <Container>
    <BasicView {...defaultProps} streams={createStreams(2)} />
  </Container>
);

export const FourUsers = () => (
  <Container>
    <BasicView {...defaultProps} streams={createStreams(3)} />
  </Container>
);
