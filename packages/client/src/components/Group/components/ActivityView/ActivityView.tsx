import React from 'react';

import useActivity from '../../../../lib/hooks/useActivity';
import { StreamsDict } from '../VideoView/VideoView';
import parseComponentTree from './lib/parseComponentTree';

export default function(props: {
  id: string;
  localStream: MediaStream | null;
  streams: StreamsDict;
  userName: string;
}) {
  const activity = useActivity(props.id);
  if (activity.data) {
    return React.createElement(
      'div',
      null,
      // @ts-ignore
      parseComponentTree([activity.data?.componentTree], props),
    );
  }
  return null;
}
