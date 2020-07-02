import { Color } from '@material-ui/core';
import firebase from 'firebase/app';
import { getColorFromHash } from 'lib/theme';
import { useContext, useEffect, useRef } from 'react';
import { atom, useRecoilState } from 'recoil';

import { FirebaseContext } from '../../components/Firebase';
import { DocumentQueryResult } from '../types';

export interface UserDocumentData {
  avatarUrl?: string;
  color?: Color;
  createdAt?: firebase.firestore.Timestamp;
  firebaseAuthId: string;
  id: string;
  name?: string;
}

export type UseReadUserResult = DocumentQueryResult<UserDocumentData>;

const DEFAULT_ME_VALUES = {
  id: '',
  name: '',
  avatarUrl: '',
  firebaseAuthId: '',
  color: undefined,
};

const getUser = async (firebaseAuthId: string) => {
  const db = firebase.firestore();

  if (!firebaseAuthId) {
    return DEFAULT_ME_VALUES;
  }

  try {
    const userRef = await db
      .collection('users')
      .where('firebaseAuthId', '==', firebaseAuthId)
      .get();

    if (userRef.docs[0]?.exists) {
      const user = await userRef.docs[0].ref.get();
      return {
        ...user.data(),
        id: userRef.docs[0].id,
        color: getColorFromHash(firebaseAuthId),
      } as UserDocumentData;
    }

    return DEFAULT_ME_VALUES;
  } catch (err) {
    console.error(err);
    return DEFAULT_ME_VALUES;
  }
};

const createUser = async (firebaseAuthId: string) => {
  const db = firebase.firestore();
  const collectionRef = db.collection('users');

  await collectionRef.add({
    firebaseAuthId,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });

  return getUser(firebaseAuthId);
};

export const authedUserIdState = atom<string | null>({
  key: 'authedUserId',
  default: null,
});

const getOrCreateUser = async (firebaseAuthId: string) => {
  if (!firebaseAuthId) {
    return DEFAULT_ME_VALUES;
  }

  const user = await getUser(firebaseAuthId);

  if (!user.id) {
    const newUser = await createUser(firebaseAuthId);
    return newUser;
  }

  return user;
};

const updateUser = async (user: UserDocumentData) => {
  if (!user.id) return;

  const db = firebase.firestore();
  const ref = db.collection('users').doc(user.id);
  return await ref.update({
    ...user,
  });
};

export const currentUserState = atom<UserDocumentData>({
  key: 'currentUser',
  default: DEFAULT_ME_VALUES,
});

export default function useUser() {
  const { firebase } = useContext(FirebaseContext);
  const authedUser = firebase.auth().currentUser;
  if (!authedUser) {
    throw new Error('Not Logged In');
  }

  const lastKnownServerValue = useRef<UserDocumentData>();

  const [currentUser, setCurrentUser] = useRecoilState(currentUserState);

  useEffect(() => {
    (async () => {
      if (!currentUser.id) {
        const user = await getOrCreateUser(authedUser.uid);
        setCurrentUser(user);
        lastKnownServerValue.current = user;
      }
    })();
  }, [authedUser.uid, currentUser, currentUser.id, setCurrentUser]);

  useEffect(() => {
    if (lastKnownServerValue.current !== currentUser && currentUser.id) {
      updateUser(currentUser);
    }
  }, [currentUser, currentUser.name]);
}
