import 'firebase/auth';

import firebase from 'firebase/app';
import { appConfig } from 'lib/constants';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { FirebaseContext, FirebaseProvider } from './Firebase';

jest.mock('firebase/app', () => {
  return {
    initializeApp: jest.fn(),
    auth: jest.fn().mockReturnValue({
      signInAnonymously: jest.fn().mockReturnValue(new Promise(jest.fn())),
      onAuthStateChanged: jest.fn(),
      currentUser: true,
      signOut: () => true,
    }),
  };
});

const MockComponent = () => {
  const { firebase } = useContext(FirebaseContext);
  expect(firebase).toBeTruthy();
  return <div />;
};

describe('FirebaseProvider', () => {
  it('should initialize firebase', () => {
    const div = document.createElement('div');

    act(() => {
      ReactDOM.render(
        <FirebaseProvider config={appConfig}>
          <MockComponent />
        </FirebaseProvider>,
        div,
      );
    });
    expect(firebase.initializeApp).toHaveBeenCalledTimes(1);
  });
});
