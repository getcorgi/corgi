import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';
import { DocumentQueryResult } from '../types';

export interface UserDocumentData {
  id: string;
  firebaseAuthId: string;
  avatarUrl: string;
  name: string;
  createdAt: string;
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

      return ref.docs[0];
    } catch (err) {
      console.error(err);
    }
  };

  const update = async (variables: {
    avatarUrl?: string;
    name?: string;
    id?: string;
  }) => {
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
