import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import useUpdateGroups from '../../lib/hooks/useUpdateGroups';
import { GroupType } from '../../lib/types';
import Home from './Home';

export default function GroupsContainer() {
  const updateGroup = useUpdateGroups();
  const [roomName, setRoomName] = useState('');
  let history = useHistory();

  async function onAddGroup(event: React.SyntheticEvent) {
    event.preventDefault();
    const group = await updateGroup({
      type: GroupType.Group,
      name: roomName,
    });

    history.push(`/groups/${group.id}`);
  }

  const onRoomNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRoomName(event.target.value);
  };

  return (
    <Home
      roomName={roomName}
      onRoomNameChange={onRoomNameChange}
      onAddGroup={onAddGroup}
    />
  );
}
