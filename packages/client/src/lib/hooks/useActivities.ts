import { useContext } from 'react';
import { useCollection } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import * as components from '../../components/Group/components/ActivityView/components';
import { CollectionQueryResult } from '../types';

interface ComponentTree {
  children: ComponentTree[];
  component: keyof typeof components;
  id: string;
  properties: {
    userId: string;
  };
}
interface ActivitiesDocumentData {
  id: string;
  name: string;
  icon: string;
  componentTree: ComponentTree;
}

export type UseActivitiesResult = CollectionQueryResult<ActivitiesDocumentData>;

export default function useActivities(
  options: {
    client?: typeof firebase;
  } = {},
): UseActivitiesResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db.collection('activities');

  const [snapshot, loading, error] = useCollection(query);
  if (error) {
    console.error(error);
  }

  return {
    snapshot,
    data: snapshot
      ? snapshot.docs.map(doc => {
          return { id: doc.id, ...doc.data() } as ActivitiesDocumentData;
        })
      : [],
    loading,
    error,
  };
}
