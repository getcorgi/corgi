import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    wrapper: {
      width: ({ width }: Props) => width,
      height: ({ height }: Props) => height,
      position: 'relative',
      overflow: 'hidden',
    },
    video: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      minWidth: '100%',
      minHeight: '100%',
      width: 'auto',
      height: 'auto',
      backgroundSize: 'cover',
      overflow: 'hidden',
    },
    mirroredVideo: {
      transform: 'rotateY(180deg)',
    },
  }),
);

interface Props {
  playsInline?: boolean;
  autoPlay?: boolean;
  srcObject: MediaStream;
  isMuted?: boolean;
  isMirrored?: boolean;
  width: string;
  height: string;
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
        playsInline={props.playsInline}
        autoPlay={props.autoPlay}
        muted={props.isMuted}
        className={`${props.isMirrored ? classes.mirroredVideo : ''} ${
          classes.video
        }`}
      />
    </Box>
  );
}
