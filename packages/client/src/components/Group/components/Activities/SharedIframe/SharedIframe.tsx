import Box from '@material-ui/core/Box';
import React, { useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useUpdateGroup from '../../../../../lib/hooks/useUpdateGroup';
import { groupIdState } from '../../../lib/GroupState';
import { SourceSelect } from '../../BrowseTogetherView/components/SourceSelect/SourceSelect';

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

  const updateGroup = useUpdateGroup();
  const groupId = useRecoilValue(groupIdState);

  const updateActivityUrl = (value: string) => {
    updateGroup({ groupId, activityUrl: value });
  };

  const onSubmitSource = (e: React.FormEvent) => {
    e.preventDefault();
    updateActivityUrl(addProtocol(sharedIframeUrl));
  };

  console.log(sharedIframeUrl);

  return (
    <Box display="flex" flexDirection="column" height="100%">
      <SourceSelect
        activityUrl={sharedIframeUrl}
        onSubmit={onSubmitSource}
        setActivityUrl={setSharedIframeUrl}
        updateActivityUrl={updateActivityUrl}
      />
      <iframe
        title="shared-browser"
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
