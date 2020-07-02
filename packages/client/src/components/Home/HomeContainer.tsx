import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { GroupType } from '../../lib/types';
import Home from './Home';
import useUpdateGroups from './lib/useUpdateGroups';

export default function GroupsContainer() {
  const updateGroups = useUpdateGroups();
  const [roomName, setRoomName] = useState('');
  const history = useHistory();

  async function onAddGroup(event: React.SyntheticEvent) {
    event.preventDefault();
    const group = await updateGroups({
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
