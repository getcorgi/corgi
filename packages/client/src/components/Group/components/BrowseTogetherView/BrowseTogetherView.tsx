import Box from '@material-ui/core/Box';
import React, { useEffect, useState } from 'react';

import { Me } from '../../../MeProvider/MeProvider';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import useReactions from '../BasicView/lib/useReactions';
import DraggableSplitWrapper from '../DraggableSplitWrapper';
import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BrowseTogetherView.styles';
import { SourceSelect } from './components/SourceSelect/SourceSelect';

interface Props {
  streams: StreamsDict;
  localStream: MediaStream | null;
  activityUrl: string;
  updateActivityUrl: (value: string) => void;
  me?: Me;
  messages: Message[];
}

const defaultProps = {
  activityUrl: '',
};

function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

function BrowseTogetherView(props: Props) {
  const streams = Object.values(props.streams);
  const [activityUrl, setActivityUrl] = useState(
    addProtocol(props.activityUrl),
  );

  const { reactions } = useReactions({
    messages: props.messages,
  });

  const myReaction = reactions[props.me?.firebaseAuthId || '']?.text || '';

  useEffect(() => {
    setActivityUrl(addProtocol(props.activityUrl));
  }, [props.activityUrl]);

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    props.updateActivityUrl(addProtocol(activityUrl));
  };

  const left = (
    <Box display="flex" flexDirection="column" height="100%">
      <SourceSelect
        activityUrl={activityUrl}
        onSubmit={onSubmitSource}
        setActivityUrl={setActivityUrl}
        updateActivityUrl={props.updateActivityUrl}
      />
      <iframe
        title="shared-browser"
        style={{
          border: 0,
          outline: 'none',
          maxHeight: '100%',
        }}
        width="100%"
        height="100%"
        src={props.activityUrl}
      />
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
            overlayText={myReaction}
            label="(You)"
          />
        </Box>
      )}

      {streams.map(({ stream, user }) => {
        if (!stream || !user) return null;

        let reaction = '';
        if (reactions && user?.id) {
          reaction = reactions[user?.id]?.text || '';
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
    </S.Streams>
  );
  return (
    <DraggableSplitWrapper
      minAsideWidth="5%"
      maxAsideWidth="75%"
      left={left}
      right={right}
    />
  );
}

BrowseTogetherView.defaultProps = defaultProps;
export default BrowseTogetherView;
