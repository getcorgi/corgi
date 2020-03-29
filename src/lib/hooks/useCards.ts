import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import { CollectionQueryResult } from '../types';

export interface CardsDocumentData {
  id: string;
  description: string;
}

export type UseCardsResult = CollectionQueryResult<CardsDocumentData>;

export default function useCards(
  id: string,
  options: {
    client?: typeof firebase;
  } = {},
): UseCardsResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db
    .collection('groups')
    .doc(id)
    .collection('cards');

  const [snapshot, loading, error] = useCollection(query);

  if (error) {
    console.error(error);
  }

  return {
    snapshot,
    data: snapshot
      ? snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as CardsDocumentData;
        })
      : [],
    loading,
    error,
  };
}
