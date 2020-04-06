import { useTheme, Typography, Input } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';

import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BasicView.styles';

interface Props {
  streams: StreamsDict;
  localStream: MediaStream;
  userName: string;
}

const getVideoHeight = (count: number) => {
  switch (count) {
    case 3:
    case 4:
      return '50%';
    case 5:
    case 6:
    case 7:
    case 8:
    case 9:
      return '33.33%';
    default:
      return '100%';
  }
};

export default function BasicView(props: Props) {
  const theme = useTheme();

  const streams = Object.values(props.streams);
  const streamCount = streams.length;

  const videoWidth = 1 / streamCount;
  const videoHeight = getVideoHeight(streamCount);

  console.log(streams);

  return (
    <Box display="flex" flexWrap="wrap" height="100%" width="100%">
      {streams.length < 1 && (
        <Box
          display="flex"
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <Box>
            <Typography variant="h5" color="textSecondary" align="center">
              Looks like you're the only one here,
            </Typography>
            <Typography variant="h5" color="textSecondary" align="center">
              send out this link to invite someone!
            </Typography>
            <Typography variant="h6" align="center">
              <Box mt={theme.spacing(0.2)}>{window.location.href}</Box>
            </Typography>
          </Box>
        </Box>
      )}

      {streams.map(({ stream, user }) => {
        if (!stream) return null;
        return (
          <Box
            width={videoWidth}
            key={stream?.id}
            height={videoHeight}
            position="relative"
          >
            <Video srcObject={stream} isMuted={false} />
            <S.Label>{user.name}</S.Label>
          </Box>
        );
      })}
      {props.localStream && (
        <S.LocalVideo>
          <Video
            key={props.localStream.id}
            srcObject={props.localStream}
            isMuted={true}
            isMirrored={true}
          />
          <S.Label>{props.userName} (You)</S.Label>
        </S.LocalVideo>
      )}
    </Box>
  );
}
