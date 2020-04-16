import { Typography, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React from 'react';

import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BasicView.styles';

interface Props {
  localStream: MediaStream | null;
  streams: StreamsDict;
  userName: string;
}

const getVideoRatios = (count: number) => {
  // max out at 5 x 5 for now
  if (count >= 10) {
    return '20%';
  }
  if (count >= 5 && count <= 9) {
    return '33.33%';
  }
  if (count >= 2 && count <= 4) {
    return '50%';
  }
  return '100%';
};

export default function BasicView(props: Props) {
  const theme = useTheme();
  const streams = Object.values(props.streams);
  const streamCount = streams.length;

  const videoWidth = getVideoRatios(streamCount);
  const videoHeight = getVideoRatios(streamCount);

  return (
    <S.BasicView
      display="flex"
      flexWrap="wrap"
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      {streams.length < 1 && (
        <Box
          display="flex"
          height="100%"
          width="100%"
          alignItems="center"
          justifyContent="center"
        >
          <S.EmptyMessage>
            <Typography variant="h5" color="inherit" align="center">
              <strong>Looks like you're the only one here,</strong>
            </Typography>
            <Typography variant="h5" color="inherit" align="center">
              <strong>send out this link to invite someone!</strong>
            </Typography>
            <Typography variant="h6" align="center" color="primary">
              <S.LinkWrapper mt={theme.spacing(0.2)}>
                {window.location.href}
              </S.LinkWrapper>
            </Typography>
          </S.EmptyMessage>
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
            <Video srcObject={stream} isMuted={false} label={user.name} />
          </Box>
        );
      })}
      {props.localStream && (
        <S.LocalVideo elevation={10}>
          <Video
            key={props.localStream.id}
            srcObject={props.localStream}
            isMuted={true}
            isMirrored={true}
            label="(You)"
          />
        </S.LocalVideo>
      )}
    </S.BasicView>
  );
}
