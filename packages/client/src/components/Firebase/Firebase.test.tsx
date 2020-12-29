import firebase from 'firebase/app';
import { appConfig } from 'lib/constants';
import React, { useContext } from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';

import { FirebaseContext, FirebaseProvider } from './Firebase';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
  auth: jest.fn(),
}));

const MockComponent = () => {
  const { firebase } = useContext(FirebaseContext);
  expect(firebase).toBeTruthy();
  return <div />;
};

describe('FirebaseProvider', () => {
  it('should initialize firebase', () => {
    // eslint-disable-next-line
    (firebase as jest.Mocked<any>).auth.mockReturnValue({
      signInAnonymously: jest.fn(() => new Promise(jest.fn())),
      onAuthStateChanged: jest.fn(),
      currentUser: {
        email: 'example@gmail.com',
        userId: 1,
        isEmailVerified: true,
      },
      signOut: () => new Promise(() => true),
    });

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
