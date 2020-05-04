import { Typography, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, { useState } from 'react';

import { Me } from '../../../MeProvider/MeProvider';
import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BasicView.styles';

interface Props {
  localStream: MediaStream | null;
  streams: StreamsDict;
  me?: Me;
}

// TODO: this sucks, make better
const getVideoRatios = (count: number) => {
  // max out at 5 x 5 for now
  if (count >= 10) {
    return { width: '20%', height: '20%' };
  }
  if (count >= 5 && count <= 9) {
    const width = '33.33%';
    let height = '50%';
    if (count > 6) {
      height = '33%';
    }

    return { width, height };
  }
  if (count >= 2 && count <= 4) {
    return { width: '50%', height: '50%' };
  }

  return { width: '100%', height: '100%' };
};

export default function BasicView(props: Props) {
  const theme = useTheme();

  const streams = Object.values(props.streams);

  const streamCount = streams.length;

  const videoWidth = getVideoRatios(streamCount).width;
  const videoHeight = getVideoRatios(streamCount).height;

  const [isCopiedTooltipOpen, setIsCopiedTooltipOpen] = useState(false);

  const isEmpty = streams.length < 1;

  const onClickLink = () => {
    navigator.clipboard.writeText(window.location.href).then(function() {
      /* clipboard successfully set */
      setIsCopiedTooltipOpen(isOpen => true);

      setTimeout(() => {
        setIsCopiedTooltipOpen(isOpen => false);
      }, 1000);
    });
  };

  return (
    <S.BasicView
      display="flex"
      flexWrap="wrap"
      height="100%"
      width="100%"
      justifyContent="center"
      alignItems="center"
    >
      {isEmpty && (
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
              <S.Tooltip title="Copied!" open={isCopiedTooltipOpen}>
                <S.LinkWrapper onClick={onClickLink} mt={theme.spacing(0.5)}>
                  {window.location.href}
                </S.LinkWrapper>
              </S.Tooltip>
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
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Video
              srcObject={stream}
              isMuted={false}
              label={user?.name}
              user={user}
            />
          </Box>
        );
      })}
      {props.localStream && (
        <S.LocalVideo elevation={10}>
          <Box width="100%" position="relative" pb="56.25%">
            <Video
              key={props.localStream.id}
              srcObject={props.localStream}
              isMuted={true}
              isMirrored={true}
              user={props.me}
              label="(You)"
            />
          </Box>
        </S.LocalVideo>
      )}
    </S.BasicView>
  );
}
