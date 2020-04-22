import { Color } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

import useUser from '../../lib/hooks/useUser';

export interface MeContextValues {
  avatarUrl: string;
  color?: Color;
  createdAt?: firebase.firestore.Timestamp;
  firebaseAuthId: string;
  id: string;
  name: string;
}

export const MeContext = React.createContext<MeContextValues | undefined>({
  id: '',
  name: '',
  avatarUrl: '',
  firebaseAuthId: '',
  color: undefined,
});

interface Props {
  children: React.ReactNode;
}

export function MeProvider(props: Props) {
  const [me, setMe] = useState<MeContextValues | undefined>();
  const { authedUser, read, create } = useUser();

  console.log(me);

  useEffect(() => {
    if (me) return;
    (async () => {
      let user = await read(authedUser.uid);

      if (!user) {
        const newUser = await create(authedUser.uid);

        if (!newUser) return;

        user = (await newUser?.get())?.data() as MeContextValues;
        return setMe({ ...user, id: newUser?.id });
      }

      setMe({ ...user, id: user.id });
    })();
  }, [me, authedUser.uid, read, create]);

  const value = me;

  return (
    <MeContext.Provider value={value}>{props.children}</MeContext.Provider>
  );
}
