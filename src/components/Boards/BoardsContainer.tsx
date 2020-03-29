import React from 'react';

import useGroups from '../../lib/hooks/useGroups';
import useUpdateGroups from '../../lib/hooks/useUpdateGroups';
import { GroupType } from '../../lib/types';
import Boards from './Boards';

export default function BoardsContainer() {
  const { data, loading, error } = useGroups();
  const updateBoard = useUpdateGroups();

  function onAddBoard() {
    updateBoard({
      type: GroupType.Board,
      name: `Board - ${new Date().toLocaleDateString('en-US', {
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

  return <Boards boards={data} onAddBoard={onAddBoard} />;
}
