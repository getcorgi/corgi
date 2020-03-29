import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import { CollectionQueryResult, GroupType } from '../types';

interface GroupsDocumentData {
  id: string;
  type: string;
  name: string;
}

export type UseGroupsResult = CollectionQueryResult<GroupsDocumentData>;

export default function useGroups(
  options: {
    client?: typeof firebase;
  } = {},
): UseGroupsResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db
    .collection('groups')
    .where('roles.viewers', 'array-contains', currentUser.uid)
    .where('type', '==', GroupType.Board)
    .orderBy('createdAt', 'desc');

  const [snapshot, loading, error] = useCollection(query);
  if (error) {
    console.error(error);
  }

  return {
    snapshot,
    data: snapshot
      ? snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as GroupsDocumentData;
        })
      : [],
    loading,
    error,
  };
}
