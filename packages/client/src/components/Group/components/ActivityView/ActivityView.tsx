import useActivity from 'lib/hooks/useActivity';
import React from 'react';

import { StreamsDict } from '../VideoView/VideoView';
import parseComponentTree from './lib/parseComponentTree';

export default function ActivityView(props: {
  id: string;
  localStream: MediaStream | null;
  streams: StreamsDict;
}) {
  const activity = useActivity(props.id);
  if (activity.data) {
    return React.createElement(
      'div',
      null,
      parseComponentTree(activity.data?.componentTree, props),
    );
  }
  return null;
}
