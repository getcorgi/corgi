import Box from '@material-ui/core/Box';
import { groupDataState } from 'lib/hooks/useGroup';
import useUpdateGroup from 'lib/hooks/useUpdateGroup';
import React, { useEffect, useRef, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

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
  default: '',
});

export default function SharedIframe() {
  const [sharedIframeUrl, setSharedIframeUrl] = useRecoilState(
    sharedIframeUrlState,
  );
  const [isSyncedWithServer, setIsSyncedWithServer] = useState(false);
  const group = useRecoilValue(groupDataState);

  const updateGroup = useUpdateGroup();

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [sharedIframeUrlInput, setSharedIframeUrlInput] = useState(
    addProtocol(group?.sharedIframeUrl || ''),
  );

  useEffect(() => {
    if (group?.sharedIframeUrl && !isSyncedWithServer) {
      setSharedIframeUrl(addProtocol(group?.sharedIframeUrl));
      setSharedIframeUrlInput(addProtocol(group?.sharedIframeUrl));
      setIsSyncedWithServer(true);
    }
  }, [
    group,
    isSyncedWithServer,
    setSharedIframeUrl,
    sharedIframeUrl,
    sharedIframeUrlInput,
  ]);

  const updateActivityUrl = (value: string) => {
    updateGroup({
      groupId: group?.groupId,
      sharedIframeUrl: addProtocol(value),
    });
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
        value={sharedIframeUrlInput}
        onSubmit={onSubmitSource}
        setValue={setSharedIframeUrlInput}
        onClickRefresh={onClickRefresh}
        placeholder="https://yoursite.com"
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
        src={addProtocol(sharedIframeUrl)}
      />
    </Box>
  );
}
