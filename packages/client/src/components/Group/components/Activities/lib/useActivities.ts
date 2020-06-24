import { useCallback, useEffect, useState } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useGroup from '../../../../../lib/hooks/useGroup';
import useUpdateGroup from '../../../../../lib/hooks/useUpdateGroup';
import { groupIdState } from '../../../lib/GroupState';

export enum ActivityId {
  SharedIframe = 'SharedIframe',
}

export const activeActivityIdsState = atom<ActivityId[]>({
  key: 'Activities__activeActivityIdsState',
  default: [],
});

const useSyncActivities = (groupId: string) => {
  const [hasMounted, setHasMounted] = useState(false);
  const [activeActivityIds, setActiveActivityIds] = useRecoilState(
    activeActivityIdsState,
  );
  const group = useGroup(groupId);

  useEffect(() => {
    if (group.data?.activityIds && !hasMounted) {
      setHasMounted(true);
      group.data?.activityIds.forEach(id => {
        if (!activeActivityIds.includes(id)) {
          setActiveActivityIds(ids => {
            return [...ids, id];
          });
        }
      });
    }
  }, [activeActivityIds, group.data, hasMounted, setActiveActivityIds]);
};

export default function useActivities() {
  const groupId = useRecoilValue(groupIdState);
  const [activeActivityIds, setActiveActivityIds] = useRecoilState(
    activeActivityIdsState,
  );

  const updateGroup = useUpdateGroup();

  const toggleActivity = useCallback(
    (activityId: ActivityId) => () => {
      let newIds = [...activeActivityIds, activityId];

      if (activeActivityIds.includes(activityId)) {
        newIds = activeActivityIds.filter(id => id !== activityId);
      }

      setActiveActivityIds(newIds);
      updateGroup({
        groupId,
        activityIds: newIds,
      });
    },
    [activeActivityIds, groupId, setActiveActivityIds, updateGroup],
  );

  useSyncActivities(groupId);

  return { toggleActivity, activeActivityIds };
}
