import { useContext } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';

import { FirebaseContext } from '../../components/Firebase';
import { ActivityId } from '../../components/Group/components/Activities/lib/useActivities';
import { DocumentQueryResult } from '../types';

interface GroupDocumentData {
  id: string;
  activityIds: ActivityId[];
  sharedIframeUrl?: string; //TEMPORARY: This will live elswhere,
  excalidrawUrl?: string; // TEMPORARY. This will live elsewhere.
  twitchChannel?: string; // TEMPORARY. This will live elsewhere.
  type: string;
  name: string;
  roles: {
    byId: { [key: string]: number };
    editors: string[];
  };
}

export type UseGroupResult = DocumentQueryResult<GroupDocumentData>;

export default function useGroup(
  id: string,
  options: {
    client?: typeof firebase;
  } = {},
): UseGroupResult {
  const { firebase } = useContext(FirebaseContext);
  const client = options.client || firebase;
  const db = client.firestore();

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db.collection('groups').doc(id);

  const [snapshot, loading, error] = useDocument(query);
  if (error) {
    console.error(error);
  }

  return {
    snapshot,
    data: snapshot && (snapshot.data() as GroupDocumentData),
    loading,
    error,
  };
}
