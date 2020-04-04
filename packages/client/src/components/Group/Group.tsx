import { IconButton } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import React from 'react';

import Video from './components/Video';

interface Props {
  onHangup: () => void;
  isCameraOff: boolean;
  isMuted: boolean;
  localStream: MediaStream;
  streams: {
    [key: string]: { user: { name: string; id: string }; stream?: MediaStream };
  };
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  userName: string;
}

export default function Group(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  const streams = Object.values(props.streams);

  return (
    <Box data-testid="group">
      <Box m={theme.spacing(0.5)} pb={addButtonSpacing}>
        {props.localStream && (
          <Box>
            <h3>{props.userName} (You)</h3>
            <Video
              key={props.localStream.id}
              srcObject={props.localStream}
              autoPlay={true}
              isMuted={true}
              isMirrored={true}
              width="600px"
              height="400px"
            />
            <IconButton
              onClick={props.toggleIsMuted}
              aria-label="mute"
              color="primary"
            >
              {props.isMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
            </IconButton>

            <IconButton
              onClick={props.toggleCamera}
              aria-label="toggle-camera"
              color="primary"
            >
              {props.isCameraOff ? <VideocamOffIcon /> : <VideocamIcon />}
            </IconButton>
          </Box>
        )}

        {streams.map(({ stream, user }) => {
          if (!stream) return null;

          return (
            <Box key={stream?.id}>
              <h3>{user.name}</h3>
              <Video
                srcObject={stream}
                autoPlay={true}
                isMuted={false}
                width="600px"
                height="400px"
              />
            </Box>
          );
        })}

        <IconButton
          onClick={props.onHangup}
          aria-label="hang-up"
          color="primary"
        >
          <CallEndIcon />
        </IconButton>
      </Box>
    </Box>
  );
}
