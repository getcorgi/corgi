import { Avatar, createStyles, makeStyles, Theme } from '@material-ui/core';
import MicOffIcon from '@material-ui/icons/MicOff';
import React, { useContext, useEffect, useRef } from 'react';

import { MediaSettingsContext } from '../../../MediaSettingsProvider';
import AudioVisualizer from '../AudioVisualizer';
import * as S from './Video.styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
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
  audioOutputDevice?: string;
  isMirrored?: boolean;
  isMuted?: boolean;
  label?: string;
  srcObject: MediaStream;
  userName?: string;
}

interface ExperimentalHTMLVideoElement extends HTMLVideoElement {
  setSinkId: (id: string) => Promise<void>;
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const classes = useStyles(props);
  const audioTrack = props.srcObject?.getAudioTracks()[0];
  const videoTrack = props.srcObject?.getVideoTracks()[0];

  const isRemoteMuted = !audioTrack?.enabled;
  const isRemoteCameraOff = !videoTrack?.enabled;

  const { activeDevices } = useContext(MediaSettingsContext);

  const clientRect = containerRef.current?.getBoundingClientRect();

  const avatarSize = clientRect ? clientRect?.height / 2 : 0;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject, isRemoteMuted, isRemoteCameraOff]);

  useEffect(() => {
    const ref = videoRef.current as ExperimentalHTMLVideoElement;

    if (ref && ref.setSinkId && activeDevices.audioOutput) {
      ref?.setSinkId(activeDevices.audioOutput);
    }
  }, [activeDevices.audioOutput]);

  return (
    <S.Video ref={containerRef}>
      {isRemoteCameraOff ? (
        <S.EmptyVideo
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <S.UserAvatar alt={props.userName} src="fallback" size={avatarSize} />
        </S.EmptyVideo>
      ) : (
        <video
          ref={videoRef}
          playsInline={true}
          autoPlay={true}
          muted={props.isMuted}
          className={`${props.isMirrored ? classes.mirroredVideo : ''} ${
            classes.video
          }`}
        />
      )}

      <S.Information>
        <S.AudioIndicator>
          {isRemoteMuted ? (
            <Avatar className={classes.muteAvatar}>
              <MicOffIcon className={classes.muteIcon} />
            </Avatar>
          ) : (
            <AudioVisualizer mediaStream={props.srcObject} />
          )}
        </S.AudioIndicator>
        {props.label && <span>{props.label}</span>}
      </S.Information>
    </S.Video>
  );
}
