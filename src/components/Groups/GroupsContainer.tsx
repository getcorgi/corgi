import React from 'react';

import useGroups from '../../lib/hooks/useGroups';
import useUpdateGroups from '../../lib/hooks/useUpdateGroups';
import { GroupType } from '../../lib/types';
import Groups from './Groups';

export default function GroupsContainer() {
  const { data, loading, error } = useGroups();
  const updateGroup = useUpdateGroups();

  function onAddGroup() {
    updateGroup({
      type: GroupType.Board,
      name: `Group - ${new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
      })}`,
    });
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error Loading Boards</div>;
  }

  return <Groups groups={data} onAddGroup={onAddGroup} />;
}
