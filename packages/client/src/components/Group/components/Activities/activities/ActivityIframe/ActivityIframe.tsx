import Box from '@material-ui/core/Box';
import React, { useRef } from 'react';

import { ActivityId } from '../../lib/useActivities';
import { ReadOnlyIframeToolbar } from '../IframeToolbar/ReadOnlyIframeToolbar';

interface Props {
  id: ActivityId;
  url: string;
}

export default function ActivityIframe(props: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const onClickRefresh = () => {
    const src = iframeRef.current?.src;
    if (iframeRef.current?.src) {
      iframeRef.current.src = src || '';
    }
  };

  return (
    <Box
      display="flex"
      position="absolute"
      flexDirection="column"
      height="100%"
      bgcolor="black"
      width="100%"
    >
      <ReadOnlyIframeToolbar
        onClickRefresh={onClickRefresh}
        activityId={props.id}
      />
      <iframe
        title={props.id}
        ref={iframeRef}
        style={{
          border: 0,
          outline: 'none',
          maxHeight: '100%',
        }}
        width="100%"
        height="100%"
        src={props.url}
      />
    </Box>
  );
}
