import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import { CollectionQueryResult } from '../types';
import useCurrentUser from './useCurrentUser';

export interface MessagesDocumentData {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
}

export type UseMessagesResult = CollectionQueryResult<MessagesDocumentData>;

export default function useMessages(
  id: string,
  options: {
    client?: typeof firebase;
  } = {},
): UseMessagesResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = useCurrentUser();

  const query = db
    .collection('groups')
    .doc(id)
    .collection('messages')
    .where('receiverId', '==', currentUser.uid);

  const [snapshot, loading, error] = useCollection(query);

  if (error) {
    console.error(error);
  }

  return {
    query,
    snapshot,
    data: snapshot
      ? snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as MessagesDocumentData;
        })
      : [],
    loading,
    error,
  };
}
