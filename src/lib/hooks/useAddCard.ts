import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';

export default function(options?: { client?: typeof firebase }) {
  const { firebase } = useContext(FirebaseContext);
  const client = (options && options.client) || firebase;
  const db = client.firestore();

  return async (
    variables: {
      groupId?: string;
      description?: string;
    },
    options: {
      merge?: boolean;
    } = { merge: true },
  ) => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      throw new Error('Not Logged In');
    }

    const ref = db
      .collection('groups')
      .doc(variables.groupId)
      .collection('cards');

    return await ref.add({
      description: variables.description,
    });
  };
}
