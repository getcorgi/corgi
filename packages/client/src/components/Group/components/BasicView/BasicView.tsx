import { Typography, useTheme } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import React, { useContext, useState } from 'react';

import { Me } from '../../../MeProvider/MeProvider';
import { GroupContext } from '../../lib/GroupContext';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BasicView.styles';
import PinnedVideoLayout from './components/PinnedVideoLayout/PinnedVideoLayout';
import TiledVideoLayout from './components/TiledVideoLayout/TiledVideoLayout';
import useReactions from './lib/useReactions';

interface Props {
  localStream: MediaStream;
  streams: StreamsDict;
  me: Me;
  messages: Message[];
}

export default function BasicView(props: Props) {
  const theme = useTheme();
  const { pinnedStreamId } = useContext(GroupContext);
  const { reactions } = useReactions({
    messages: props.messages,
  });

  const streams = Object.values(props.streams);

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
    <Box height="100%" width="100%">
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
      <>
        {pinnedStreamId && streams.length > 1 ? (
          <PinnedVideoLayout
            streams={streams}
            reactions={reactions}
            pinnedStreamId={pinnedStreamId}
            localStream={props.localStream}
            me={props.me}
          />
        ) : (
          <TiledVideoLayout
            streams={streams}
            reactions={reactions}
            localStream={props.localStream}
            me={props.me}
          />
        )}
      </>
    </Box>
  );
}
