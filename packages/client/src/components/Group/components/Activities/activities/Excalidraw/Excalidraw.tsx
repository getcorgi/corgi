import { groupDataState } from 'lib/hooks/useGroup';
import useUpdateGroup from 'lib/hooks/useUpdateGroup';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import { ActivityId } from '../../lib/useActivities';
import ActivityIframe from '../ActivityIframe';

const generateId = (length: number) =>
  Array(length)
    .fill(0)
    .map(x =>
      Math.random()
        .toString(36)
        .charAt(2),
    )
    .join('');

const generateExalidrawUrl = () => {
  const roomId = generateId(20);
  const secret = generateId(22);

  return `https://excalidraw.com/#room=${roomId},${secret}`;
};

export default function Excalidraw() {
  const group = useRecoilValue(groupDataState);
  const updateGroup = useUpdateGroup();

  const [url, setUrl] = useState('');

  useEffect(() => {
    if (group?.excalidrawUrl && !url) {
      setUrl(group?.excalidrawUrl);
      return;
    }

    if (!url && group?.groupId) {
      const newUrl = generateExalidrawUrl();

      updateGroup({
        groupId: group?.groupId,
        excalidrawUrl: newUrl,
      });
      setUrl(newUrl);
    }
  }, [group, updateGroup, url]);

  return <ActivityIframe id={ActivityId.Excalidraw} url={url} />;
}
