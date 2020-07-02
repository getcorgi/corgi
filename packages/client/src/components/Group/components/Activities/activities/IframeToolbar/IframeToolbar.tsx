import { Box, Divider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import RefreshIcon from '@material-ui/icons/Refresh';
import SearchIcon from '@material-ui/icons/Search';
import React, { useRef } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { backgroundColor } from '../../../../../../lib/theme';
import { pinnedStreamIdState } from '../../../../lib/GroupState';
import { isAdminState } from '../../../../lib/useIsAdmin/useIsAdmin';
import ActivityContextMenu from '../../ActivityContextMenu/ActivityContextMenu';
import useActivities, { ActivityId } from '../../lib/useActivities';
import * as S from './IframeToolbar.styles';

interface Props {
  value: string;
  activityId: ActivityId;
  setValue: (url: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClickRefresh: () => void;
  placeholder: string;
  title?: string | null;
}

export function IframeToolbar({ title = null, ...props }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { toggleActivity } = useActivities();
  const [pinnedActivityId, setPinnedActivityId] = useRecoilState(
    pinnedStreamIdState,
  );

  const isAdmin = useRecoilValue(isAdminState);

  const onClick = () => {
    inputRef.current?.setSelectionRange(0, props.value.length);
  };

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setValue(event.target.value);
  };

  const onClickRefresh = () => {
    props.onClickRefresh();
  };

  const togglePinnedActivity = () => {
    if (pinnedActivityId === props.activityId) {
      setPinnedActivityId(null);
      return;
    }
    setPinnedActivityId(props.activityId);
  };

  return (
    <ActivityContextMenu activityId={props.activityId}>
      <Box display="flex" width="100%" bgcolor={backgroundColor[900]}>
        <S.Form onSubmit={props.onSubmit}>
          <Box
            pr={2}
            display="flex"
            justifyContent="space-between"
            width="100%"
            alignItems="center"
          >
            <IconButton
              onClick={onClickRefresh}
              style={{ margin: '4px', padding: '4px 6px' }}
            >
              <RefreshIcon style={{ fontSize: '16px' }} />
            </IconButton>
            <Divider orientation="vertical" flexItem={true} />
            {title && (
              <Box ml={2}>
                <S.Title>{title}</S.Title>
              </Box>
            )}

            <S.Input
              value={props.value}
              onChange={onInputChange}
              onClick={onClick}
              inputProps={{ 'aria-label': 'go to url' }}
              inputRef={inputRef}
              placeholder={props.placeholder}
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

        <Box>
          <IconButton
            style={{ margin: '4px', padding: '4px 6px' }}
            onClick={togglePinnedActivity}
          >
            {pinnedActivityId === props.activityId ? (
              <FullscreenExitIcon style={{ fontSize: '22px' }} />
            ) : (
              <FullscreenIcon style={{ fontSize: '22px' }} />
            )}
          </IconButton>
        </Box>

        {isAdmin && (
          <Box>
            <IconButton
              style={{ margin: '4px', padding: '4px 6px' }}
              onClick={toggleActivity(props.activityId)}
            >
              <CloseIcon style={{ fontSize: '22px' }} />
            </IconButton>
          </Box>
        )}
      </Box>
    </ActivityContextMenu>
  );
}
