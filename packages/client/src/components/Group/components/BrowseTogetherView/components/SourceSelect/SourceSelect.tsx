import {
  Box,
  Divider,
  IconButton,
  ListSubheader,
  MenuItem,
  Paper,
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import React, { useState } from 'react';

import * as S from './SourceSelect.styles';

interface Props {
  activityUrl: string;
  setActivityUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  updateActivityUrl: (value: string) => void;
}

export function SourceSelect(props: Props) {
  const [srcPreset, setSrcPreset] = useState('http://');

  const onSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!event.target.value) return;

    setSrcPreset(event.target.value as string);
    props.setActivityUrl(event.target.value as string);
    props.updateActivityUrl(event.target.value as string);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setActivityUrl(event.target.value);
  };

  return (
    <Paper component="form" square onSubmit={props.onSubmit}>
      <Box px={2} display="flex" justifyContent="space-between">
        <S.Select value={srcPreset} onChange={onSelectChange}>
          <S.MenuItem value="http://">Url</S.MenuItem>
          <S.ListSubheader>Video</S.ListSubheader>
          <S.MenuItem value="https://player.twitch.tv/?channel=">
            Twitch
          </S.MenuItem>
          <S.MenuItem value="https://www.youtube.com/embed/">
            Youtube
          </S.MenuItem>
          <S.ListSubheader>Games</S.ListSubheader>
          <S.MenuItem value="https://dominion.games">Dominion</S.MenuItem>
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
