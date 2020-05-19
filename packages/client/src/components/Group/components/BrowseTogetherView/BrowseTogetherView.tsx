import { IconButton, InputBase, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';

import { Me } from '../../../MeProvider/MeProvider';
import DraggableSplitWrapper from '../DraggableSplitWrapper';
import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BrowseTogetherView.styles';

interface Props {
  streams: StreamsDict;
  localStream: MediaStream | null;
  activityUrl: string;
  updateActivityUrl: (value: string) => void;
  me?: Me;
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

  useEffect(() => {
    setActivityUrl(addProtocol(props.activityUrl));
  }, [props.activityUrl]);

  const left = (
    <Box display="flex" flexDirection="column" height="100%">
      <Paper
        component="form"
        square
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();
          props.updateActivityUrl(activityUrl);
        }}
      >
        <Box px={2} display="flex" justifyContent="space-between">
          <InputBase
            style={{ width: '100%' }}
            value={activityUrl}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setActivityUrl(addProtocol(event.target.value))
            }
            inputProps={{ 'aria-label': 'go to url' }}
          />
          <IconButton type="submit" aria-label="search">
            <SearchIcon />
          </IconButton>
        </Box>
      </Paper>
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
            label="(You)"
          />
        </Box>
      )}

      {streams.map(({ stream, user }) => {
        if (!stream || !user) return null;

        return (
          <Box key={stream?.id} width="100%" position="relative" pb="56.25%">
            <Video
              srcObject={stream}
              isMuted={false}
              label={user.name}
              user={user}
              hasContextMenu={true}
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
