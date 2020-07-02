import Box from '@material-ui/core/Box';
import React, { useEffect, useRef, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useGroup from '../../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../../lib/hooks/useUpdateGroup';
import { groupIdState } from '../../../../lib/GroupState';
import { ActivityId } from '../../lib/useActivities';
import { IframeToolbar } from '../IframeToolbar/IframeToolbar';

function addProtocol(url: string) {
  if (!/^(?:f|ht)tps?:\/\//.test(url)) {
    url = 'https://' + url;
  }
  return url;
}

export const sharedIframeUrlState = atom<string>({
  key: 'Activities__sharedIframeUrl',
  default: 'https://',
});

export default function SharedIframe() {
  const [sharedIframeUrl, setSharedIframeUrl] = useRecoilState(
    sharedIframeUrlState,
  );
  const groupId = useRecoilValue(groupIdState);
  const group = useGroup(groupId);
  const updateGroup = useUpdateGroup();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sharedIframeUrlInput, setSharedIframeUrlInput] = useState(
    addProtocol(group.data?.sharedIframeUrl || 'https://'),
  );

  useEffect(() => {
    if (
      group.data?.sharedIframeUrl &&
      group.data?.sharedIframeUrl !== sharedIframeUrl
    ) {
      setSharedIframeUrl(addProtocol(group.data?.sharedIframeUrl));
      setSharedIframeUrlInput(addProtocol(group.data?.sharedIframeUrl));
    }
  }, [group, setSharedIframeUrl, sharedIframeUrl]);

  const updateActivityUrl = (value: string) => {
    updateGroup({ groupId, sharedIframeUrl: value });
  };

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivityUrl(addProtocol(sharedIframeUrlInput));
    setSharedIframeUrl(sharedIframeUrlInput);
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
        activityId={ActivityId.SharedIframe}
        activityUrl={sharedIframeUrlInput}
        onSubmit={onSubmitSource}
        setActivityUrl={setSharedIframeUrlInput}
        updateActivityUrl={updateActivityUrl}
        onClickRefresh={onClickRefresh}
      />
      <iframe
        title="shared-browser"
        ref={iframeRef}
        style={{
          border: 0,
          outline: 'none',
          maxHeight: '100%',
        }}
        width="100%"
        height="100%"
        src={sharedIframeUrl}
      />
    </Box>
  );
}
