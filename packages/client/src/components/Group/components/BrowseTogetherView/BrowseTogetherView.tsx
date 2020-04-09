import { IconButton, InputBase, Paper } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import React, { useEffect, useState } from 'react';

import Video from '../Video';
import { StreamsDict } from '../VideoView/VideoView';
import * as S from './BrowseTogetherView.styles';

interface Props {
  streams: StreamsDict;
  localStream: MediaStream;
  userName: string;
  activityUrl: string;
  updateActivityUrl: (value: string) => void;
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

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      height="100%"
      width="100%"
      justifyContent="space-between"
    >
      <Box width={5 / 6} display="flex" flexDirection="column">
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
          style={{ border: 0, outline: 'none', maxHeight: '100%' }}
          width="100%"
          height="100%"
          src={props.activityUrl}
        />
      </Box>
      <S.Streams width={1 / 6}>
        {props.localStream && (
          <Box>
            <Video
              key={props.localStream.id}
              srcObject={props.localStream}
              isMuted={true}
              isMirrored={true}
            />
            <S.Label>(You)</S.Label>
          </Box>
        )}

        {streams.map(({ stream, user }) => {
          if (!stream) return null;

          return (
            <Box key={stream?.id} width="100%" position="relative">
              <Video srcObject={stream} isMuted={false} />
              <S.Label>{user.name}</S.Label>
            </Box>
          );
        })}
      </S.Streams>
    </Box>
  );
}

BrowseTogetherView.defaultProps = defaultProps;
export default BrowseTogetherView;
