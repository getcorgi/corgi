import { renderHook } from '@testing-library/react-hooks';
import firebase from 'firebase/app';

import { firebaseConfig } from '../../constants';
import useGroups from './useGroups';

describe('useGroups', () => {
  beforeAll(async () => {
    firebase.initializeApp(firebaseConfig);
    jest.spyOn(firebase, 'auth').mockReturnValue({
      currentUser: {
        uid: 'bar',
      },
    } as firebase.auth.Auth);
    await firebase.firestore().enableNetwork();
  });

  afterAll(async () => {
    // prevent jest from hanging:
    // https://github.com/facebook/jest/issues/7287#issuecomment-488886582
    await firebase.firestore().disableNetwork();
  });

  it('returns data from useFireStoreQuery', () => {
    const { result } = renderHook(() => {
      return useGroups({ client: firebase });
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(undefined);
    expect(result.current.data).toEqual([]);
  });
});
