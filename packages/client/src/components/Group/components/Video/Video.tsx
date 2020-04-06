import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      position: 'relative',
      overflow: 'hidden',
      width: '100%',
      height: '100%',
    },
    video: {
      width: '100%',
      height: 'auto',
    },
    mirroredVideo: {
      transform: 'rotateY(180deg)',
    },
  }),
);

interface Props {
  srcObject: MediaStream;
  isMuted?: boolean;
  isMirrored?: boolean;
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const classes = useStyles(props);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject]);

  return (
    <Box className={classes.wrapper}>
      <video
        ref={videoRef}
        playsInline={true}
        autoPlay={true}
        muted={props.isMuted}
        className={`${props.isMirrored ? classes.mirroredVideo : ''} ${
          classes.video
        }`}
      />
    </Box>
  );
}
