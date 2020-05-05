import React, { createContext, useState } from 'react';

import { noop } from '../../../constants';

interface Props {
  children: React.ReactNode;
}

interface GroupContextValue {
  pinnedStreamId: string | null;
  setPinnedStreamId: (id: string | null) => void;
}

export const GroupContext = createContext({
  pinnedStreamId: null,
  setPinnedStreamId: noop,
} as GroupContextValue);

export function GroupProvider(props: Props) {
  const [pinnedStreamId, setPinnedStreamId] = useState<string | null>(null);

  console.log({ pinnedStreamId });

  const value = {
    pinnedStreamId,
    setPinnedStreamId,
  };

  return (
    <GroupContext.Provider value={value}>
      {props.children}
    </GroupContext.Provider>
  );
}
