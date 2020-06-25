import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

import useGroup from '../../../../lib/hooks/useGroup';
import { currentUserState } from '../../../../lib/hooks/useUser';

export const isAdminState = atom({
  key: 'Group__isAdmin',
  default: false,
});

export default function useIsAdmin(groupId: string) {
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
  const group = useGroup(groupId);
  const me = useRecoilValue(currentUserState);

  useEffect(() => {
    const newIsAdmin = Boolean(
      group.data?.roles.editors.some(editor => editor === me?.firebaseAuthId),
    );
    if (isAdmin !== newIsAdmin) {
      setIsAdmin(newIsAdmin);
    }
  }, [group.data, isAdmin, me, setIsAdmin]);

  return isAdmin;
}
