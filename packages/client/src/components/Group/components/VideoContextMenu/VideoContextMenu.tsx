import {
  Box,
  FormControlLabel,
  Grid,
  Menu,
  Slider,
  Switch,
  Typography,
} from '@material-ui/core';
import { VolumeDown, VolumeUp } from '@material-ui/icons';
import theme from 'lib/theme';
import React, { useState } from 'react';
import { useRecoilState } from 'recoil';

import { pinnedStreamIdState } from '../../lib/GroupState';

interface Props {
  children: React.ReactNode;
  volume: number;
  setVolume: (volume: number) => void;
  streamId: string;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function VideoContextMenu(props: Props) {
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

  const onVolumeChange = (
    e: React.ChangeEvent<{}>,
    value: number | number[],
  ) => {
    if (typeof value === 'number') {
      props.setVolume(value);
    }
  };

  const onPinnedVideoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPinnedStreamId(event.target.checked ? props.streamId : null);
  };

  const onDoubleClickVideo = () => {
    setPinnedStreamId(
      pinnedStreamId === props.streamId ? null : props.streamId,
    );
  };

  return (
    <>
      <Box
        width="100%"
        height="100%"
        onContextMenu={handleOpenMenu}
        onDoubleClick={onDoubleClickVideo}
      >
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
                checked={pinnedStreamId === props.streamId}
                onChange={onPinnedVideoChange}
                name="pinnedVideo"
              />
            }
            label="Pin Video"
            labelPlacement="start"
          />

          <Typography id="volume-slider" gutterBottom>
            Volume
          </Typography>
          <Grid container spacing={2}>
            <Grid item>
              <VolumeDown />
            </Grid>
            <Grid item xs>
              <Slider
                value={props.volume}
                onChange={onVolumeChange}
                aria-labelledby="volume-slider"
              />
            </Grid>
            <Grid item>
              <VolumeUp />
            </Grid>
          </Grid>
        </Box>
      </Menu>
    </>
  );
}
