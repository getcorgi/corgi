import React from 'react';

import Video from '../../../Video';
import { StreamsDict } from '../../../VideoView/VideoView';

export default function VideoWrapper(props: {
  id: string;
  localStream: MediaStream | null;
  streams: StreamsDict;
  streamIndex: number;
  userId: string;
}) {
  const streamKeys = Object.keys(props.streams);
  const selectedStreamKey = streamKeys[props.streamIndex];
  if (!selectedStreamKey) return null;

  const { stream, user } = props.streams[selectedStreamKey];

  if (!stream || !user) return null;

  return (
    <Video srcObject={stream} isMuted={false} user={user} label={user.name} />
  );
}
