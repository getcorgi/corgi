import { Box } from '@material-ui/core';
import { UserDocumentData } from 'lib/hooks/useUser';
import React from 'react';

import { User } from '../../../../lib/useSocketHandler';
import mapActivityIdToComponent from '../../../Activities/lib/mapActivityIdToComponent';
import { ActivityId } from '../../../Activities/lib/useActivities';
import DraggableSplitWrapper from '../../../DraggableSplitWrapper';
import Video from '../../../Video';
import { ReactionMap } from '../../lib/useReactions';
import * as S from './PinnedVideoLayout.styles';

interface Props {
  activeActivityIds: ActivityId[];
  streams: { user: User; stream?: MediaStream }[];
  localStream: MediaStream;
  pinnedStreamId: string | null;
  me: UserDocumentData;
  reactions: ReactionMap;
}

export default function PinnedVideoLayout(props: Props) {
  const pinnedStream = props.streams.find(stream => {
    return stream.stream?.id === props.pinnedStreamId;
  });

  const otherStreams = props.streams.filter(stream => {
    return stream.stream?.id !== props.pinnedStreamId;
  });

  const pinnedActivity = props.activeActivityIds.find(
    id => id === props.pinnedStreamId,
  );

  const otherActivities = props.activeActivityIds.filter(
    id => id !== props.pinnedStreamId,
  );

  const myReaction = props.reactions[props.me?.firebaseAuthId]?.text || '';

  const renderPinnedItem = () => {
    const pinnedVideo = mapActivityIdToComponent(pinnedActivity);

    if (pinnedVideo) {
      return pinnedVideo;
    }

    if (pinnedStream && pinnedStream.stream) {
      return (
        <Video
          hasContextMenu={true}
          isMuted={false}
          label={pinnedStream.user?.name}
          srcObject={pinnedStream.stream}
          user={pinnedStream.user}
        />
      );
    }
    return null;
  };

  const left = (
    <Box height="100%" width="100%">
      {renderPinnedItem()}
    </Box>
  );
  const right = (
    <S.Streams>
      {props.localStream && (
        <Box width="100%" position="relative" pb="56.25%">
          <Video
            key={props.localStream.id}
            srcObject={props.localStream}
            isMuted={true}
            isMirrored={true}
            user={props.me}
            label={props.me.name}
            overlayText={myReaction}
          />
        </Box>
      )}

      {otherStreams.map(({ stream, user }) => {
        if (!stream || !user) return null;

        let reaction = '';
        if (props.reactions && user?.id) {
          reaction = props.reactions[user?.id]?.text || '';
        }

        return (
          <Box key={stream?.id} width="100%" position="relative" pb="56.25%">
            <Video
              srcObject={stream}
              isMuted={false}
              label={user.name}
              user={user}
              hasContextMenu={true}
              overlayText={reaction}
            />
          </Box>
        );
      })}

      {otherActivities.map(id => {
        return (
          <Box
            key={id}
            width="100%"
            position="relative"
            pb="76.25%"
            overflow="hidden"
          >
            {mapActivityIdToComponent(id)}
          </Box>
        );
      })}
    </S.Streams>
  );
  return (
    <Box width="100%" height="100%">
      <DraggableSplitWrapper
        minAsideWidth="5%"
        maxAsideWidth="75%"
        left={left}
        right={right}
      />
    </Box>
  );
}
