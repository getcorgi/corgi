import { Box, FormControlLabel, Menu, Switch } from '@material-ui/core';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import theme from '../../../../../lib/theme';
import { pinnedStreamIdState } from '../../../lib/GroupState';
import { ActivityId } from '../lib/useActivities';

interface Props {
  children: React.ReactNode;
  activityId: ActivityId;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function ActivityContextMenu(props: Props) {
  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const [pinnedStreamId, setPinnedStreamId] = useRecoilState(
    pinnedStreamIdState,
  );

  const handleOpenMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = () => {
    setState(initialState);
  };

  const onPinnedVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPinnedStreamId(event.target.checked ? props.activityId : null);
  };

  const onDoubleClick = () => {
    setPinnedStreamId(
      pinnedStreamId === props.activityId ? null : props.activityId,
    );
  };

  return (
    <>
      <Box onContextMenu={handleOpenMenu} onDoubleClick={onDoubleClick}>
        {props.children}
      </Box>
      <Menu
        keepMounted
        open={state.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          state.mouseY !== null && state.mouseX !== null
            ? { top: state.mouseY, left: state.mouseX }
            : undefined
        }
      >
        <Box width="200px" p={theme.spacing(0.3)}>
          <FormControlLabel
            style={{ margin: 0, marginBottom: theme.spacing(1) }}
            control={
              <Switch
                color="primary"
                checked={pinnedStreamId === props.activityId}
                onChange={onPinnedVideoChange}
                name="pinnedVideo"
              />
            }
            label="Pin Activity"
            labelPlacement="start"
          />
        </Box>
      </Menu>
    </>
  );
}
