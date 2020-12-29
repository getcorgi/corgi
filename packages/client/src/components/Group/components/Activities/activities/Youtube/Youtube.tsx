import Box from '@material-ui/core/Box';
import { SocketContext } from 'components/Group/lib/SocketContext';
import useIsAdmin from 'components/Group/lib/useIsAdmin';
import { User } from 'components/Group/lib/useSocketHandler';
import { groupDataState } from 'lib/hooks/useGroup';
import useUpdateGroup from 'lib/hooks/useUpdateGroup';
import { currentUserState } from 'lib/hooks/useUser';
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import YouTubePlayer, { YouTubeProps } from 'react-youtube';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ActivityId } from '../../lib/useActivities';
import { IframeToolbar } from '../IframeToolbar/IframeToolbar';

interface YoutubeSyncMessage {
  data: { [key: string]: any };
  user: User;
  createdAt: number;
}

const S = {
  Youtube: styled(Box)`
    .react-youtube-player {
      width: 100%;
      height: 100%;
    }
  `,
};

export default function Youtube() {
  const group = useRecoilValue(groupDataState);
  const { socket } = useContext(SocketContext);
  const me = useRecoilValue(currentUserState);
  const isAdmin = useIsAdmin();

  const updateGroup = useUpdateGroup();
  const [videoIdInput, setVideoIdInput] = useState(group?.youtubeVideoId || '');

  const [isVideoIdSynced, setIsChannelIdSynced] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoPlayerInstance = useRef();

  const videoId = group?.youtubeVideoId || '';

  const updateInterval = useRef(-1);

  useEffect(() => {
    if (videoId && videoIdInput !== videoId && !isVideoIdSynced) {
      setVideoIdInput(videoId);
      setIsChannelIdSynced(true);
    }
  }, [videoId, videoIdInput, isVideoIdSynced]);

  const updateActivityUrl = (value: string) => {
    let videoId;
    try {
      const url = new URL(value);
      const params = new URLSearchParams(url.searchParams);
      videoId = params.get('v') as string;
    } catch {
      videoId = value;
    }

    if (!videoId) return;

    updateGroup({ groupId: group?.groupId, youtubeVideoId: videoId });
  };

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivityUrl(videoIdInput);
  };

  const onClickRefresh = () => {
    const src = iframeRef.current?.src;
    if (iframeRef.current?.src) {
      iframeRef.current.src = src || '';
    }
  };

  const sendYoutubeSyncData = useCallback(
    (data: YoutubeSyncMessage['data']) => {
      socket.emit('sendYoutubeSyncData', { data });
    },
    [socket],
  );

  const sendYoutubeLatestPosition = () => {
    // @ts-ignore
    const position = videoPlayerInstance.current?.getCurrentTime();
    sendYoutubeSyncData({ position });
  };

  useEffect(() => {
    socket.on('receivedYoutubeSyncData', (message: YoutubeSyncMessage) => {
      if (message.user.firebaseAuthId !== me.firebaseAuthId) {
        if (!videoPlayerInstance.current) return;

        if (message.data?.play) {
          // @ts-ignore
          videoPlayerInstance.current?.playVideo();
        }

        if (message.data?.pause) {
          // @ts-ignore
          videoPlayerInstance.current?.pauseVideo();
        }
        if (message.data?.position) {
          // @ts-ignore
          const currentTime = videoPlayerInstance.current.getCurrentTime();
          const hostTime = message.data.position;
          if (hostTime - currentTime > 0.75 || currentTime - hostTime > 0.75) {
            // @ts-ignore
            videoPlayerInstance.current?.seekTo(message.data.position);
          }
        }
      }
    });

    return function cleanup() {
      socket.removeEventListener('receivedYoutubeSyncData');
    };
  }, [me.firebaseAuthId, socket]);

  const youtubePlayerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1 as const,
    },
  };

  const onReady: YouTubeProps['onReady'] = e => {
    videoPlayerInstance.current = e.target;
  };

  const onPlay: YouTubeProps['onPlay'] = e => {
    sendYoutubeSyncData({ play: true });

    if (isAdmin) {
      updateInterval.current = window.setInterval(
        sendYoutubeLatestPosition,
        500,
      );
    }
  };

  const onPause: YouTubeProps['onPause'] = e => {
    sendYoutubeSyncData({ pause: true });

    if (isAdmin && updateInterval.current) {
      window.clearInterval(updateInterval.current);
    }
  };

  useEffect(() => {
    return function cleanup() {
      window.clearInterval(updateInterval.current);
    };
  }, []);

  return (
    <S.Youtube
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="black"
      position="absolute"
      width="100%"
    >
      <IframeToolbar
        activityId={ActivityId.Youtube}
        value={videoIdInput}
        onSubmit={onSubmitSource}
        setValue={setVideoIdInput}
        onClickRefresh={onClickRefresh}
        placeholder="Youtube url or videoId"
        title="Youtube"
      />
      <YouTubePlayer
        videoId={videoId}
        opts={youtubePlayerOpts}
        containerClassName="react-youtube-player"
        onPlay={onPlay} // defaults -> noop
        onPause={onPause}
        onReady={onReady}
        onEnd={onPause}
      />
    </S.Youtube>
  );
}
