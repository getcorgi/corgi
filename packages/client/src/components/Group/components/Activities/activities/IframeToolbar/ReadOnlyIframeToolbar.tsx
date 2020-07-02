import { Box, Divider, IconButton } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import RefreshIcon from '@material-ui/icons/Refresh';
import { backgroundColor } from 'lib/theme';
import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';

import { pinnedStreamIdState } from '../../../../lib/GroupState';
import { isAdminState } from '../../../../lib/useIsAdmin/useIsAdmin';
import ActivityContextMenu from '../../ActivityContextMenu/ActivityContextMenu';
import { ACTIVITIES_BY_ID } from '../../lib/activityData';
import useActivities, { ActivityId } from '../../lib/useActivities';
import * as S from './IframeToolbar.styles';

interface Props {
  activityId: ActivityId;
  onClickRefresh: () => void;
}

export function ReadOnlyIframeToolbar(props: Props) {
  const isAdmin = useRecoilValue(isAdminState);
  const [pinnedActivityId, setPinnedActivityId] = useRecoilState(
    pinnedStreamIdState,
  );

  const activity = ACTIVITIES_BY_ID[props.activityId];

  const onClickRefresh = () => {
    props.onClickRefresh();
  };

  const { toggleActivity } = useActivities();

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
        <Box display="flex" width="100%" alignItems="center">
          <IconButton
            onClick={onClickRefresh}
            style={{ margin: '4px', padding: '4px 6px' }}
          >
            <RefreshIcon style={{ fontSize: '16px' }} />
          </IconButton>
          <Divider orientation="vertical" flexItem={true} />
          <Box ml={2}>
            <S.Title>{activity.label}</S.Title>
          </Box>
        </Box>

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
