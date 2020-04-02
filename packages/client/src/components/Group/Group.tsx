import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

import Video from './components/Video';
import * as S from './Group.styles';

interface Props {
  hangup: () => void;
  streams: { [key: string]: { userId: string, stream?: MediaStream } };
  localStream: { userId: string, stream?: MediaStream };
  toggleIsMuted: () => void;
  toggleCamera: () => void;
}

export default function Group(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  const streams = Object.values(props.streams);
  console.log(streams);

  return (
    <Box data-testid="group">
      <Box m={theme.spacing(0.5)} pb={addButtonSpacing}>
        {props.localStream?.stream && (
          <Video
            key={props.localStream.stream.id}
            srcObject={props.localStream.stream}
            autoPlay={true}
            isMuted={true}
            isMirrored={true}
            width="600px"
            height="400px"
          />
        )}

        {streams.map(({ stream }) => {
          if (!stream) return null;

          return (
            <Video
              key={stream?.id}
              srcObject={stream}
              autoPlay={true}
              isMuted={false}
              width="600px"
              height="400px"
            />
          )
        })}

        <div>
          <button onClick={props.hangup} id="hangupButton">
            Hang Up
          </button>
        </div>
      </Box>
    </Box>
  );
}
