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
import React, { useContext, useEffect, useState } from 'react';

import theme from '../../../../lib/theme';
import {
  ChromeCastButton,
  ChromeCastContext,
} from '../../../ChromeCastProvider/ChromeCastProvider';
import { GroupContext } from '../../lib/GroupContext';

interface Props {
  children: React.ReactNode;
  volume: number;
  setVolume: (volume: number) => void;
  srcObject: MediaStream;
}

const initialState = {
  mouseX: null,
  mouseY: null,
};

export default function VideoContextMenu(props: Props) {
  const { getCastContext } = useContext(ChromeCastContext);

  const [state, setState] = useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialState);

  const { pinnedStreamId, setPinnedStreamId } = useContext(GroupContext);

  useEffect(() => {
    const castContext = getCastContext();
    if (!castContext) return;
    castContext?.addEventListener(
      cast.framework.CastContextEventType.CAST_STATE_CHANGED,
      e => {
        console.log(e, 'hello');
        if (e.castState === 'CONNECTED') {
          const castSession = castContext.getCurrentSession();

          if (!castSession) return;

          const objectURL = URL.createObjectURL(props.srcObject);

          console.log({ objectURL });

          const mediaInfo = new chrome.cast.media.MediaInfo(
            objectURL,
            'MediaStream',
          );

          const request = new chrome.cast.media.LoadRequest(mediaInfo);
          castSession.loadMedia(request).then(
            function() {
              console.log('Load succeed');
            },
            function(errorCode) {
              console.log('Error code: ' + errorCode);
            },
          );
        }
      },
    );
  }, [getCastContext, props.srcObject]);

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
    setPinnedStreamId(event.target.checked ? props.srcObject.id : null);
  };

  const onDoubleClickVideo = () => {
    setPinnedStreamId(
      pinnedStreamId === props.srcObject.id ? null : props.srcObject.id,
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
                checked={pinnedStreamId === props.srcObject.id}
                onChange={onPinnedVideoChange}
                name="pinnedVideo"
              />
            }
            label="Pin Video"
            labelPlacement="start"
          />

          <ChromeCastButton />

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
