import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';
import { ActivityId } from '../../components/Group/components/Activities/lib/useActivities';

export default function(options?: { client?: typeof firebase }) {
  const { firebase } = useContext(FirebaseContext);
  const client = (options && options.client) || firebase;
  const db = client.firestore();

  return async (variables: {
    groupId?: string;
    activityIds?: ActivityId[];
    sharedIframeUrl?: string; // TEMPORARY. This will live elsewhere.
    excalidrawUrl?: string; // TEMPORARY. This will live elsewhere.
    twitchChannel?: string; // TEMPORARY. This will live elsewhere.
    youtubeVideoId?: string; // TEMPORARY. This will live elsewhere.
    youtubeHostUserId?: string; // TEMPORARY. This will live elsewhere.
  }) => {
    const currentUser = firebase.auth().currentUser;

    if (!currentUser) {
      throw new Error('Not Logged In');
    }

    const ref = db.collection('groups').doc(variables.groupId);

    return await ref.update({
      ...variables,
    });
  };
}
