import { useContext } from 'react';
import { useSetRecoilState } from 'recoil';

import { FirebaseContext } from '../../components/Firebase';
import { ActivityId } from '../../components/Group/components/Activities/lib/useActivities';
import { groupDataState } from './useGroup';

export default function(options?: { client?: typeof firebase }) {
  const { firebase } = useContext(FirebaseContext);
  const client = (options && options.client) || firebase;
  const db = client.firestore();

  const setGroupData = useSetRecoilState(groupDataState);

  return async (variables: {
    groupId?: string;
    activityIds?: ActivityId[];
    sharedIframeUrl?: string; // TEMPORARY. This will live elsewhere.
    excalidrawUrl?: string; // TEMPORARY. This will live elsewhere.
    twitchChannel?: string; // TEMPORARY. This will live elsewhere.
  }) => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      throw new Error('Not Logged In');
    }

    const ref = db.collection('groups').doc(variables.groupId);

    setGroupData(prevData => ({
      ...prevData,
      ...variables,
    }));

    return await ref.update({
      ...variables,
    });
  };
}
