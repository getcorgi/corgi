import 'firebase/auth';
import 'firebase/firestore';

import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';

export const FirebaseContext = React.createContext({
  firebase: {},
} as {
  firebase: typeof firebase;
});

type ConfigVariableValue = string | undefined;

interface FirebaseProviderProps {
  config: {
    apiKey: ConfigVariableValue;
    authDomain: ConfigVariableValue;
    databaseURL: ConfigVariableValue;
    projectId: ConfigVariableValue;
    storageBucket: ConfigVariableValue;
    messagingSenderId: ConfigVariableValue;
    appId: ConfigVariableValue;
    measurementId: ConfigVariableValue;
  };
  loaderNode?: React.ReactNode;
  children: React.ReactNode;
}

export function FirebaseProvider(props: FirebaseProviderProps) {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  useEffect(() => {
    // Initialize Firebase
    firebase.initializeApp(props.config);

    // Authenticate
    firebase
      .auth()
      .signInAnonymously()
      .catch(error => {
        // TODO: handle auth error here.
      });

    // Update logged in state
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // User is signed in.
        setIsLoggedIn(true);
      } else {
        // User is signed out.
        setIsLoggedIn(false);
      }
    });

    setIsInitialized(true);

    // Clean up
    return () => {
      unsubscribe();
    };
  }, [props.config]);

  if (!isInitialized || !isLoggedIn) {
    return <>{props.loaderNode ? props.loaderNode : null}</>;
  }

  return (
    <FirebaseContext.Provider value={{ firebase }}>
      {props.children}
    </FirebaseContext.Provider>
  );
}
