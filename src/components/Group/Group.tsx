import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

import Video from './components/Video';
import * as S from './Group.styles';

interface Props {
  call: () => void;
  hangup: () => void;
  streams: Set<MediaStream>;
}

export default function Group(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  console.log(props.streams);

  const [yourStream, ...streams] = props.streams;

  return (
    <Box data-testid="group">
      <Divider />
      <Box m={theme.spacing(0.5)} pb={addButtonSpacing}>
        {yourStream && (
          <Video
            key={yourStream.id}
            srcObject={yourStream}
            autoPlay={true}
            isMuted={true}
            isMirrored={true}
          />
        )}

        {streams.map(stream => (
          <Video
            key={stream.id}
            srcObject={stream}
            autoPlay={true}
            isMuted={false}
          />
        ))}

        <div>
          <button onClick={props.call} id="callButton">
            Call
          </button>
          <button onClick={props.hangup} id="hangupButton">
            Hang Up
          </button>
        </div>
      </Box>
    </Box>
  );
}
