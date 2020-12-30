import {
  Avatar,
  CircularProgress,
  createStyles,
  makeStyles,
  Theme,
  Tooltip,
} from '@material-ui/core';
import MicOffIcon from '@material-ui/icons/MicOff';
import { UserDocumentData } from 'lib/hooks/useUser';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';
import useResizeObserver from 'use-resize-observer';

import CrownIcon from '../../../Icons/Crown';
import { MediaSettingsContext } from '../../../MediaSettingsProvider';
import { groupAdminIdState } from '../../lib/GroupState';
import { User } from '../../lib/useSocketHandler';
import Draw from '../Activities/activities/Draw';
import AudioVisualizer from '../AudioVisualizer';
import VideoContextMenu from '../VideoContextMenu/VideoContextMenu';
import VideoOverlay from './components/VideoOverlay/VideoOverlay';
import * as S from './Video.styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    video: {
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      position: 'relative',
    },
    audioOnlyVideo: {
      opacity: 0,
      height: 0,
      width: 0,
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
    cameraOff: {
      opacity: 0,
    },
    portraitMode: {
      objectFit: 'contain',
    },
  }),
);

interface Props {
  audioOutputDevice?: string;
  hasContextMenu?: boolean;
  isAdmin?: boolean;
  isMirrored?: boolean;
  isMuted?: boolean;
  label?: string;
  overlayText?: string;
  srcObject: MediaStream;
  user?: User | UserDocumentData;
}

const getIsScreenShare = (name?: string) => {
  if (!name) return false;

  return Boolean(name.match('Screen Share'));
};

interface ExperimentalHTMLVideoElement extends HTMLVideoElement {
  setSinkId: (id: string) => Promise<void>;
}

export default function Video(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const {
    ref: containerRef,
    height: containerRefHeight = 1,
    width: containerRefWidth = 1,
  } = useResizeObserver<HTMLDivElement>();
  const classes = useStyles(props);
  const audioTrack = props.srcObject?.getAudioTracks()[0];
  const videoTrack = props.srcObject?.getVideoTracks()[0];

  const isScreenShare = getIsScreenShare(props.user?.name);

  const { aspectRatio } = videoTrack?.getSettings() || {};

  const isInPortraitMode = Number(aspectRatio) < 1 || isScreenShare;

  const [volume, setVolume] = useState(100);
  const [isVideoLoading, setIsVideoLoading] = useState(false);

  const isRemoteMuted = !audioTrack?.enabled;
  const isRemoteCameraOff = !videoTrack?.enabled;

  const { activeDevices } = useContext(MediaSettingsContext);
  const adminId = useRecoilValue(groupAdminIdState);

  const isAdmin = Boolean(adminId && props.user?.firebaseAuthId === adminId);

  const avatarSize =
    containerRefHeight < containerRefWidth
      ? containerRefHeight / 2
      : containerRefWidth / 2;

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject, isRemoteCameraOff]);

  useEffect(() => {
    const onLoadStart = () => setIsVideoLoading(true);
    const onLoadedData = () => setIsVideoLoading(false);
    const video = videoRef.current;
    if (video) {
      video.addEventListener('loadstart', onLoadStart);
      video.addEventListener('loadeddata', onLoadedData);
    }
    return function cleanup() {
      video?.removeEventListener('loadstart', onLoadStart);
      video?.removeEventListener('loadeddata', onLoadedData);
    };
  });

  useEffect(() => {
    const ref = videoRef.current as ExperimentalHTMLVideoElement;

    if (ref && ref.setSinkId && activeDevices.audioOutput) {
      ref?.setSinkId(activeDevices.audioOutput);
    }
  }, [activeDevices.audioOutput]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume / 100;
    }
  }, [volume]);

  const renderVideo = () => (
    <S.Video ref={containerRef}>
      {isRemoteCameraOff ? (
        <S.EmptyVideo
          height="100%"
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="center"
          userColor={props.user?.color}
        >
          <S.UserAvatar
            alt={props.user?.name}
            src="fallback"
            size={avatarSize}
            userColor={props.user?.color}
          />
          <video
            ref={videoRef}
            playsInline={true}
            autoPlay={true}
            muted={props.isMuted}
            className={classes.audioOnlyVideo}
          />
        </S.EmptyVideo>
      ) : (
        <S.VideoWrapper>
          {isVideoLoading && (
            <S.LoadingIndicator flexDirection="column">
              <CircularProgress />
            </S.LoadingIndicator>
          )}
          <video
            ref={videoRef}
            playsInline={true}
            autoPlay={true}
            muted={props.isMuted}
            className={`${props.isMirrored ? classes.mirroredVideo : ''} ${
              classes.video
            } ${isRemoteCameraOff ? classes.cameraOff : ''} ${
              isInPortraitMode ? classes.portraitMode : ''
            }`}
          />
        </S.VideoWrapper>
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
        {props.label && (
          <S.VideoLabel>
            {props.label}{' '}
            {isAdmin && (
              <Tooltip title="Room Owner">
                <S.CrownIcon>
                  <CrownIcon />
                </S.CrownIcon>
              </Tooltip>
            )}
          </S.VideoLabel>
        )}
      </S.Information>
      {props.overlayText && (
        <VideoOverlay text={props.overlayText} size={avatarSize} />
      )}
      {isScreenShare && <Draw />}
    </S.Video>
  );

  if (props.hasContextMenu) {
    return (
      <VideoContextMenu
        setVolume={setVolume}
        volume={volume}
        streamId={props.srcObject.id}
      >
        {renderVideo()}
      </VideoContextMenu>
    );
  }

  return renderVideo();
}
