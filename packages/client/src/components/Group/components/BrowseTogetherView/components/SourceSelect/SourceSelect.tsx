import { Box, Divider, IconButton, Paper } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { useCallback, useState } from 'react';

import * as S from './SourceSelect.styles';

interface Props {
  activityUrl: string;
  setActivityUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  updateActivityUrl: (value: string) => void;
}

const generateId = (length: number) =>
  Array(length)
    .fill(0)
    .map(x =>
      Math.random()
        .toString(36)
        .charAt(2),
    )
    .join('');

export function SourceSelect(props: Props) {
  const [srcPreset, setSrcPreset] = useState('https://');

  const onSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!event.target.value) return;

    setSrcPreset(event.target.value as string);
    props.setActivityUrl(event.target.value as string);
    props.updateActivityUrl(event.target.value as string);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setActivityUrl(event.target.value);
  };

  const getExalidrawUrl = useCallback(() => {
    const roomId = generateId(20);
    const secret = generateId(22);

    return `https://excalidraw.com/#room=${roomId},${secret}`;
  }, []);

  return (
    <Paper component="form" square onSubmit={props.onSubmit}>
      <Box px={2} display="flex" justifyContent="space-between">
        <S.Select value={srcPreset} onChange={onSelectChange}>
          <S.MenuItem value="https://">Url</S.MenuItem>
          <S.ListSubheader>Video</S.ListSubheader>
          <S.MenuItem value="https://player.twitch.tv/?channel=">
            Twitch
          </S.MenuItem>
          <S.MenuItem value="https://www.youtube.com/embed/">
            Youtube
          </S.MenuItem>
          <S.ListSubheader>Games</S.ListSubheader>
          <S.MenuItem value="https://dominion.games">Dominion</S.MenuItem>
          <S.ListSubheader>Tools</S.ListSubheader>
          <S.MenuItem value={getExalidrawUrl()}>Excalidraw</S.MenuItem>
        </S.Select>
        <Divider orientation="vertical" flexItem={true} />
        <S.Input
          value={props.activityUrl}
          autoFocus={true}
          onChange={onInputChange}
          inputProps={{ 'aria-label': 'go to url' }}
        />
        <IconButton
          type="submit"
          aria-label="search"
          style={{ margin: '4px', padding: '4px' }}
        >
          <SearchIcon style={{ fontSize: '22px' }} />
        </IconButton>
      </Box>
    </Paper>
  );
}
