import { IconButton } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import CallEndIcon from '@material-ui/icons/CallEnd';
import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import React from 'react';

export interface StreamsDict {
  [key: string]: { user: { name: string; id: string }; stream?: MediaStream };
}

interface Props {
  onHangup: () => void;
  isCameraOff: boolean;
  isMuted: boolean;
  streams: StreamsDict;
  toggleCamera: () => void;
  toggleIsMuted: () => void;
  children: ({ streams }: { streams: StreamsDict }) => React.ReactNode;
}

export default function VideoView(props: Props) {
  const theme = useTheme();

  return (
    <>
      <div>{props.children({ streams: props.streams })}</div>

      <div>
        <IconButton
          onClick={props.onHangup}
          aria-label="hang-up"
          color="primary"
        >
          <CallEndIcon />
        </IconButton>

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
      </div>
    </>
  );
}
