import React, { useEffect, useState } from 'react';

import useUser from '../../lib/hooks/useUser';

interface MeContextValues {
  id?: string;
  name: string;
  avatarUrl: string;
  firebaseAuthId: string;
  color: string;
  createdAt?: firebase.firestore.Timestamp;
}

export const MeContext = React.createContext<MeContextValues | undefined>({
  id: '',
  name: '',
  avatarUrl: '',
  firebaseAuthId: '',
  color: '',
});

interface Props {
  children: React.ReactNode;
}

export function MeProvider(props: Props) {
  const [me, setMe] = useState<MeContextValues | undefined>();
  const { authedUser, read, create } = useUser();

  useEffect(() => {
    if (me) return;
    (async () => {
      const userDoc = await read(authedUser.uid);

      if (!userDoc?.exists) {
        const newUser = await create(authedUser.uid);

        const me = (await newUser?.get())?.data() as MeContextValues;
        return setMe({ ...me, id: newUser?.id });
      }

      const me = (await userDoc?.ref.get())?.data() as MeContextValues;
      setMe({ ...me, id: userDoc.id });
    })();
  }, [me, authedUser.uid, read, create]);

  const value = me;

  return (
    <MeContext.Provider value={value}>{props.children}</MeContext.Provider>
  );
}
