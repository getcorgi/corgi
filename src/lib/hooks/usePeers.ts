import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import { CollectionQueryResult } from '../types';
import useCurrentUser from './useCurrentUser';

export interface PeersDocumentData {
  id: string;
  userId: string;
  message: string;
}

export type UsePeersResult = CollectionQueryResult<PeersDocumentData>;

export default function usePeers(
  id: string,
  options: {
    client?: typeof firebase;
  } = {},
): UsePeersResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  useCurrentUser();

  const query = db
    .collection('groups')
    .doc(id)
    .collection('peers');

  const [snapshot, loading, error] = useCollection(query);

  if (error) {
    console.error(error);
  }

  return {
    query,
    snapshot,
    data: snapshot
      ? snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as PeersDocumentData;
        })
      : [],
    loading,
    error,
  };
}
