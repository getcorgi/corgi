import { useContext } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import * as components from '../../components/Group/components/ActivityView/components';
import { DocumentQueryResult } from '../types';

type ComponentTree = {
  component: keyof typeof components;
  properties?: { [key: string]: any };
  id: string;
  children?: ComponentTree;
}[];

interface ActivityDocumentData {
  id: string;
  name: string;
  icon: string;
  componentTree: ComponentTree;
}

export type UseActivityResult = DocumentQueryResult<ActivityDocumentData>;

export default function useActivity(
  id: string,
  options: {
    client?: typeof firebase;
  } = {},
): UseActivityResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db.collection('activities').doc(id);

  const [snapshot, loading, error] = useDocument(query);
  if (error) {
    console.error(error);
  }

  return {
    snapshot,
    data: snapshot && (snapshot.data() as ActivityDocumentData),
    loading,
    error,
  };
}
