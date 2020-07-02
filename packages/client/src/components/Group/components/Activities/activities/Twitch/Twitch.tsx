import Box from '@material-ui/core/Box';
import React, { useEffect, useRef, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { groupDataState } from '../../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../../lib/hooks/useUpdateGroup';
import { ActivityId } from '../../lib/useActivities';
import { IframeToolbar } from '../IframeToolbar/IframeToolbar';

export default function Twitch() {
  const group = useRecoilValue(groupDataState);

  const updateGroup = useUpdateGroup();
  const [channelIdInput, setChannelIdInput] = useState(
    group?.twitchChannel || '',
  );

  const [isChannelIdSynced, setIsChannelIdSynced] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const channelId = group?.twitchChannel || '';

  useEffect(() => {
    if (channelId && channelIdInput !== channelId && !isChannelIdSynced) {
      setChannelIdInput(channelId);
      setIsChannelIdSynced(true);
    }
  }, [channelId, channelIdInput, isChannelIdSynced]);

  const updateActivityUrl = (value: string) => {
    updateGroup({ groupId: group?.groupId, twitchChannel: value });
  };

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivityUrl(channelIdInput);
  };

  const onClickRefresh = () => {
    const src = iframeRef.current?.src;
    if (iframeRef.current?.src) {
      iframeRef.current.src = src || '';
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="black"
      position="absolute"
      width="100%"
    >
      <IframeToolbar
        activityId={ActivityId.Twitch}
        value={channelIdInput}
        onSubmit={onSubmitSource}
        setValue={setChannelIdInput}
        onClickRefresh={onClickRefresh}
        placeholder="Channel name eg: grandpoobear"
        title="Twitch"
      />
      <iframe
        title="twitch"
        ref={iframeRef}
        style={{
          border: 0,
          outline: 'none',
          maxHeight: '100%',
        }}
        width="100%"
        height="100%"
        src={`https://player.twitch.tv?channel=${channelId}&parent=corgi.chat&parent=localhost`}
      />
    </Box>
  );
}
