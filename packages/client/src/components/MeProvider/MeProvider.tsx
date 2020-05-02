import React, { useEffect, useState } from 'react';

import { noop } from '../../constants';
import useUser, { UserDocumentData } from '../../lib/hooks/useUser';

export type Me = UserDocumentData;

interface MeContextValues {
  me: Me;
  updateMe: (values: Partial<Me>) => void;
}

const DEFAULT_ME_VALUES = {
  id: '',
  name: '',
  avatarUrl: '',
  firebaseAuthId: '',
  color: undefined,
};

export const MeContext = React.createContext<MeContextValues>({
  me: DEFAULT_ME_VALUES,
  updateMe: noop,
});

interface Props {
  children: React.ReactNode;
}

export function MeProvider(props: Props) {
  const [me, setMe] = useState<Me>(DEFAULT_ME_VALUES);
  const { authedUser, read, create, update } = useUser();

  useEffect(() => {
    if (me.createdAt) return;
    (async () => {
      let user = await read(authedUser.uid);

      if (!user) {
        const newUser = await create(authedUser.uid);

        if (!newUser) return;

        user = (await newUser?.get())?.data() as Me;
        return setMe({ ...user, id: newUser?.id });
      }

      setMe({ ...user, id: user.id });
    })();
  }, [me, authedUser.uid, read, create]);

  const updateMe = (values: Partial<Me>) => {
    update(values);
    setMe({ ...me, ...values });
  };

  const value = { me, updateMe };

  return (
    <MeContext.Provider value={value}>{props.children}</MeContext.Provider>
  );
}
