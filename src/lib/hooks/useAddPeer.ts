import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';

export default function(options?: { client?: typeof firebase }) {
  const { firebase } = useContext(FirebaseContext);
  const client = (options && options.client) || firebase;
  const db = client.firestore();

  return (
    variables: {
      groupId: string;
      message: string;
      userId: string;
    },
    options: {
      merge?: boolean;
    } = { merge: true },
  ) => {
    const ref = db
      .collection('groups')
      .doc(variables.groupId)
      .collection('peers');

    return ref.add({
      userId: variables.userId,
      message: variables.message,
    });
  };
}
