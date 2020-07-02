import { groupDataState } from 'lib/hooks/useGroup';
import { currentUserState } from 'lib/hooks/useUser';
import { useEffect } from 'react';
import { atom, useRecoilState, useRecoilValue } from 'recoil';

export const isAdminState = atom({
  key: 'Group__isAdmin',
  default: false,
});

export default function useIsAdmin() {
  const [isAdmin, setIsAdmin] = useRecoilState(isAdminState);
  const group = useRecoilValue(groupDataState);
  const me = useRecoilValue(currentUserState);

  useEffect(() => {
    const newIsAdmin = Boolean(
      group?.roles?.editors.some(editor => editor === me?.firebaseAuthId),
    );
    if (isAdmin !== newIsAdmin) {
      setIsAdmin(newIsAdmin);
    }
  }, [group, isAdmin, me, setIsAdmin]);

  return isAdmin;
}
