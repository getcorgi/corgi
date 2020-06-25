import { Box, Divider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import React, { useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { backgroundColor } from '../../../../../../../lib/theme';
import { isAdminState } from '../../../../../lib/useIsAdmin/useIsAdmin';
import ActivityContextMenu from '../../../ActivityContextMenu/ActivityContextMenu';
import useActivities, { ActivityId } from '../../../lib/useActivities';
import * as S from './SourceSelect.styles';

interface Props {
  activityUrl: string;
  setActivityUrl: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  updateActivityUrl: (value: string) => void;
  onClickRefresh: () => void;
}

enum PresetKind {
  Item = 'Item',
  GroupLabel = 'GroupLabel',
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

const getExalidrawUrl = () => {
  const roomId = generateId(20);
  const secret = generateId(22);

  return `https://excalidraw.com/#room=${roomId},${secret}`;
};

const srcPresets = [
  {
    label: 'Video',
    kind: PresetKind.GroupLabel,
  },
  {
    label: 'Twitch',
    value: 'twitch',
    url: 'https://player.twitch.tv/?channel=',
    kind: PresetKind.Item,
  },
  // {
  //   label: 'Youtube',
  //   value: 'youtube',
  //   url: 'https://www.youtube.com/embed/',
  //   kind: PresetKind.Item,
  // },
  {
    label: 'Games',
    kind: PresetKind.GroupLabel,
  },
  {
    label: 'Dominion',
    value: 'dominion',
    url: 'https://dominion.games',
    kind: PresetKind.Item,
  },
  {
    label: 'Tools',
    kind: PresetKind.GroupLabel,
  },
  {
    label: 'Excalidraw',
    value: 'excalidraw',
    url: getExalidrawUrl(),
    kind: PresetKind.Item,
  },
];

export function SourceSelect(props: Props) {
  const [srcPreset, setSrcPreset] = useState('https://');
  const inputRef = useRef<HTMLInputElement>(null);

  const { toggleActivity } = useActivities();

  const isAdmin = useRecoilValue(isAdminState);

  const onClick = () => {
    inputRef.current?.setSelectionRange(0, props.activityUrl.length);
  };

  const onSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    if (!event.target.value) return;

    setSrcPreset(event.target.value as string);
    props.setActivityUrl(event.target.value as string);
    props.updateActivityUrl(event.target.value as string);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setActivityUrl(event.target.value);
  };

  const onClickRefresh = () => {
    props.onClickRefresh();
  };

  return (
    <ActivityContextMenu activityId={ActivityId.SharedIframe}>
      <Box display="flex" width="100%" bgcolor={backgroundColor[900]}>
        <S.Form onSubmit={props.onSubmit}>
          <Box
            px={2}
            display="flex"
            justifyContent="space-between"
            width="100%"
          >
            <S.Select value={srcPreset} onChange={onSelectChange}>
              <S.MenuItem value="https://">Url</S.MenuItem>
              {srcPresets.map(node => {
                if (node.kind === PresetKind.Item) {
                  return <S.MenuItem value={node.url}>{node.label}</S.MenuItem>;
                }
                return <S.ListSubheader>{node.label}</S.ListSubheader>;
              })}
            </S.Select>
            <Divider orientation="vertical" flexItem={true} />
            <IconButton
              onClick={onClickRefresh}
              style={{ margin: '4px', padding: '4px 6px' }}
            >
              <RefreshIcon style={{ fontSize: '16px' }} />
            </IconButton>
            <S.Input
              value={props.activityUrl}
              onChange={onInputChange}
              onClick={onClick}
              inputProps={{ 'aria-label': 'go to url' }}
              inputRef={inputRef}
            />
            <IconButton
              type="submit"
              aria-label="search"
              style={{
                margin: '4px',
                padding: '4px 6px',
                visibility: 'hidden',
              }}
            >
              <SearchIcon style={{ fontSize: '22px' }} />
            </IconButton>
          </Box>
        </S.Form>

        {isAdmin && (
          <Box>
            <IconButton
              style={{ margin: '4px', padding: '4px 6px' }}
              onClick={toggleActivity(ActivityId.SharedIframe)}
            >
              <CloseIcon style={{ fontSize: '22px' }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </ActivityContextMenu>
  );
}
