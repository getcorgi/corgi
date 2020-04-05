import { useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';

import Video from './components/Video';
import { StreamsDict } from './VideoView';

interface Props {
  streams: StreamsDict;
  localStream: MediaStream;
  userName: string;
}
export default function BasicView(props: Props) {
  const theme = useTheme();

  return (
    <Box data-testid="group">
      <Box m={theme.spacing(0.5)}>
        {props.localStream && (
          <Box>
            <h3>{props.userName} (You)</h3>
            <Video
              key={props.localStream.id}
              srcObject={props.localStream}
              isMuted={true}
              isMirrored={true}
              width="600px"
              height="400px"
            />
          </Box>
        )}

        {Object.values(props.streams).map(({ stream, user }) => {
          if (!stream) return null;

          return (
            <Box key={stream?.id}>
              <h3>{user.name}</h3>
              <Video
                srcObject={stream}
                isMuted={false}
                width="600px"
                height="400px"
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
