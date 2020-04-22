import { Color } from '@material-ui/core';
import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';
import { getColorFromHash } from '../theme';
import { DocumentQueryResult } from '../types';

export interface UserDocumentData {
  avatarUrl: string;
  color?: Color;
  createdAt?: firebase.firestore.Timestamp;
  firebaseAuthId: string;
  id: string;
  name: string;
}

export type UseReadUserResult = DocumentQueryResult<UserDocumentData>;

export default function useUser() {
  const { firebase } = useContext(FirebaseContext);
  const db = firebase.firestore();

  const authedUser = firebase.auth().currentUser;
  if (!authedUser) {
    throw new Error('Not Logged In');
  }

  const create = async (id: string) => {
    try {
      const ref = db.collection('users');
      return ref.add({
        firebaseAuthId: id,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const read = async (id: string) => {
    try {
      const ref = await db
        .collection('users')
        .where('firebaseAuthId', '==', id)
        .get();

      if (ref.docs[0].exists) {
        const user = await ref.docs[0].ref.get();
        return {
          ...user.data(),
          id: ref.docs[0].id,
          color: getColorFromHash(id),
        } as UserDocumentData;
      }
      return null;
    } catch (err) {
      console.error(err);
    }
  };

  const update = async (variables: {
    avatarUrl?: string;
    name?: string;
    id?: string;
  }) => {
    if (!variables.id) return;

    const ref = db.collection('users').doc(variables.id);

    return await ref.update({
      ...variables,
    });
  };

  return {
    authedUser,
    create,
    read,
    update,
  };
}
