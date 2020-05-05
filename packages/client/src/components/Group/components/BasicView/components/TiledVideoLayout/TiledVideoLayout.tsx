import { Box } from '@material-ui/core';
import React from 'react';

import { Me } from '../../../../../MeProvider/MeProvider';
import { User } from '../../../../lib/useSocketHandler';
import Video from '../../../Video';
import * as S from './TiledVideoLayout.styles';

interface Props {
  streams: { user: User; stream?: MediaStream }[];
  localStream: MediaStream;
  me: Me;
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

export default function TiledVideoLayout(props: Props) {
  const streamCount = props.streams.length;
  const videoWidth = getVideoRatios(streamCount).width;
  const videoHeight = getVideoRatios(streamCount).height;

  return (
    <>
      {props.streams.map(({ stream, user }) => {
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
              hasContextMenu={true}
              isMuted={false}
              label={user?.name}
              srcObject={stream}
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
    </>
  );
}
