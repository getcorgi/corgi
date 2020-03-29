import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';
import { GroupType } from '../types';

export default function(options?: { client?: typeof firebase }) {
  const { firebase } = useContext(FirebaseContext);
  const client = (options && options.client) || firebase;
  const db = client.firestore();

  return async (
    variables: {
      createdAt?: firebase.firestore.FieldValue;
      id?: string;
      name: string;
      type: GroupType;
    },
    options: {
      merge?: boolean;
    } = { merge: true },
  ) => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      throw new Error('Not Logged In');
    }

    const ref = db.collection('groups');

    if (variables.id) {
      await ref.doc(variables.id).set(variables, options);

      return ref.doc(variables.id);
    }

    return await ref.add({
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      roles: {
        byId: {
          [currentUser.uid]: 0,
        },
        viewers: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
        editors: firebase.firestore.FieldValue.arrayUnion(currentUser.uid),
      },
      ...variables,
    });
  };
}
