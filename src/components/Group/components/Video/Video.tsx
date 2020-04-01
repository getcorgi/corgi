import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useEffect, useRef } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const classes = useStyles();

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject]);

  return (
    <video
      ref={videoRef}
      playsInline={props.playsInline}
      autoPlay={props.autoPlay}
      muted={props.isMuted}
      className={props.isMirrored ? classes.mirroredVideo : ''}
    />
  );
}
