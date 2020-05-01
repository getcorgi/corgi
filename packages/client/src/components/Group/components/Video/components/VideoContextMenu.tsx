import React from 'react';
import Menu from '@material-ui/core/Menu';
import Typography from '@material-ui/core/Typography';
import { Grid, Slider, Box } from '@material-ui/core';
import { VolumeDown, VolumeUp } from '@material-ui/icons';
import theme from '../../../../../lib/theme';

interface Props {
  children: React.ReactNode;
  volume: number;
  setVolume: (volume: number) => void;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function VideoContextMenu(props: Props) {
  const [state, setState] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

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

  return (
    <>
      <Box width="100%" height="100%" onContextMenu={handleOpenMenu}>
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
