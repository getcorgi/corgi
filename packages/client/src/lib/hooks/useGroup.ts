import { useContext, useEffect } from 'react';
import { useDocument } from 'react-firebase-hooks/firestore';
import { atom, useRecoilState } from 'recoil';

import { FirebaseContext } from '../../components/Firebase';
import { ActivityId } from '../../components/Group/components/Activities/lib/useActivities';
import { DocumentQueryResult } from '../types';

export interface GroupDocumentData {
  id: string;
  groupId: string;
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

export const groupDataState = atom<Partial<GroupDocumentData> | null>({
  key: 'Group__groupData',
  default: null,
});

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
  const [groupData, setGroupData] = useRecoilState(groupDataState);

  const currentUser = client.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  const query = db.collection('groups').doc(id);

  const [snapshot, loading, error] = useDocument(query);
  if (error) {
    console.error(error);
  }

  const snapshotData = snapshot?.data();

  useEffect(() => {
    if (
      snapshotData?.groupId &&
      JSON.stringify(groupData) !== JSON.stringify(snapshotData)
    ) {
      setGroupData((snapshotData as GroupDocumentData) || null);
    }
  }, [groupData, setGroupData, snapshot, snapshotData]);

  return {
    snapshot,
    data: snapshot && (snapshot.data() as GroupDocumentData),
    loading,
    error,
  };
}
