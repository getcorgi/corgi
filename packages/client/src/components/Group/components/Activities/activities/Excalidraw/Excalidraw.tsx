import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

import useGroup from '../../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../../lib/hooks/useUpdateGroup';
import { groupIdState } from '../../../../lib/GroupState';
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
  const groupId = useRecoilValue(groupIdState);
  const group = useGroup(groupId);
  const updateGroup = useUpdateGroup();

  const [url, setUrl] = useState('');

  useEffect(() => {
    if (group.data?.excalidrawUrl && !url) {
      setUrl(group.data?.excalidrawUrl);
      return;
    }

    if (!url && group.data?.id) {
      const newUrl = generateExalidrawUrl();

      updateGroup({
        groupId,
        excalidrawUrl: newUrl,
      });
      setUrl(newUrl);
    }
  }, [group, groupId, updateGroup, url]);

  return <ActivityIframe id={ActivityId.Excalidraw} url={url} />;
}
