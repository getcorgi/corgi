import {
  Avatar,
  Box,
  createStyles,
  makeStyles,
  Theme,
} from '@material-ui/core';
import MicOffIcon from '@material-ui/icons/MicOff';
import React, { useContext, useEffect, useRef } from 'react';

import { MediaSettingsContext } from '../../../MediaSettingsProvider';
import * as S from './Video.styles';

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
    muteAvatar: {
      height: '20px',
      width: '20px',
      backgroundColor: theme.palette.secondary.main,
      color: 'white',
    },
    muteIcon: {
      fontSize: '14px',
    },
  }),
);

interface Props {
  srcObject: MediaStream;
  isMuted?: boolean;
  isMirrored?: boolean;
  audioOutputDevice?: string;
  label?: string;
}

interface ExperimentalHTMLVideoElement extends HTMLVideoElement {
  setSinkId: (id: string) => Promise<void>;
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const classes = useStyles(props);
  const track = props.srcObject?.getAudioTracks()[0];
  const isRemoteMuted = track.muted || !track.enabled;

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
      <S.Information>
        <S.AudioIndicator>
          {isRemoteMuted ? (
            <Avatar className={classes.muteAvatar}>
              <MicOffIcon className={classes.muteIcon} />
            </Avatar>
          ) : (
            <S.AudioSignal />
          )}
        </S.AudioIndicator>
        {props.label && <span>{props.label}</span>}
      </S.Information>
    </Box>
  );
}
