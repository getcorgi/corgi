import React, { createContext, useState } from 'react';

import { noop } from '../../../constants';

interface Props {
  children: React.ReactNode;
  adminId: string;
}

interface GroupContextValue {
  pinnedStreamId: string | null;
  setPinnedStreamId: (id: string | null) => void;
  adminId: string;
}

export const GroupContext = createContext({
  pinnedStreamId: null,
  setPinnedStreamId: noop,
  adminId: '',
} as GroupContextValue);

export function GroupProvider(props: Props) {
  const [pinnedStreamId, setPinnedStreamId] = useState<string | null>(null);

  const value = {
    pinnedStreamId,
    setPinnedStreamId,
    adminId: props.adminId,
  };

  return (
    <GroupContext.Provider value={value}>
      {props.children}
    </GroupContext.Provider>
  );
}
