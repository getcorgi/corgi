import { Box } from '@material-ui/core';
import React from 'react';
import useResizeObserver from 'use-resize-observer/polyfilled';

import { Me } from '../../../../../MeProvider/MeProvider';
import { User } from '../../../../lib/useSocketHandler';
import Video from '../../../Video';
import getVideoDimensions from './lib/getVideoDimensions';
import * as S from './TiledVideoLayout.styles';

interface Props {
  streams: { user: User; stream?: MediaStream }[];
  localStream: MediaStream;
  me: Me;
}

export default function TiledVideoLayout(props: Props) {
  const streamCount = props.streams.length;
  const {
    ref: containerRef,
    height: containerRefHeight,
    width: containerRefWidth,
  } = useResizeObserver<HTMLDivElement>();

  const { width: videoWidth, height: videoHeight } = getVideoDimensions({
    count: streamCount,
    width: containerRefWidth,
    height: containerRefHeight,
  });

  const isPortraitMode = Number(containerRefWidth) < Number(containerRefHeight);

  return (
    <S.TiledVideo ref={containerRef}>
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
        <S.LocalVideo elevation={10} isPortraitMode={isPortraitMode}>
          <Box
            width="100%"
            position="relative"
            pb={isPortraitMode ? '125%' : '56.25%'}
          >
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
    </S.TiledVideo>
  );
}
