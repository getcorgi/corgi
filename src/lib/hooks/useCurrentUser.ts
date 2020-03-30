import { useContext } from 'react';

import { FirebaseContext } from '../../components/Firebase';

export default function useCurrentUser() {
  const { firebase } = useContext(FirebaseContext);

  const currentUser = firebase.auth().currentUser;
  if (!currentUser) {
    throw new Error('Not Logged In');
  }

  return currentUser;
}
