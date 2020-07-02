import Box from '@material-ui/core/Box';
import { groupDataState } from 'lib/hooks/useGroup';
import useUpdateGroup from 'lib/hooks/useUpdateGroup';
import React, { useEffect, useRef, useState } from 'react';
import YouTubePlayer, { YouTubeProps } from 'react-youtube';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';

import { ActivityId } from '../../lib/useActivities';
import { IframeToolbar } from '../IframeToolbar/IframeToolbar';

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

  const updateGroup = useUpdateGroup();
  const [videoIdInput, setVideoIdInput] = useState(group?.youtubeVideoId || '');

  const [isVideoIdSynced, setIsChannelIdSynced] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const videoId = group?.youtubeVideoId || '';

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

  const youtubePlayerOpts = {
    height: '100%',
    width: '100%',
    playerVars: {
      modestbranding: 1 as 1,
    },
  };

  const onPlay: YouTubeProps['onPlay'] = e => {
    console.log(e, 'tell everyone to play');
  };

  const onPause: YouTubeProps['onPause'] = e => {
    console.log(e, 'tell everyone to pause');
  };

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
      />
    </S.Youtube>
  );
}
