import { Box, createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { useContext, useEffect, useRef } from 'react';

import { MediaSettingsContext } from '../../../MediaSettingsProvider';

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
      height: '100%',
      objectFit: 'cover',
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
  audioOutputDevice?: string;
}

interface ExperimentalHTMLVideoElement extends HTMLVideoElement {
  setSinkId: (id: string) => Promise<void>;
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const classes = useStyles(props);

  const { currentAudioOutputDevice } = useContext(MediaSettingsContext);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject]);

  useEffect(() => {
    const ref = videoRef.current as ExperimentalHTMLVideoElement;

    if (ref && ref.setSinkId && currentAudioOutputDevice) {
      ref?.setSinkId(currentAudioOutputDevice);
    }
  }, [currentAudioOutputDevice]);

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
