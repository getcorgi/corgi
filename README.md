# corgi

[![Build Status](https://travis-ci.org/getcorgi/corgi.svg?branch=master)](https://travis-ci.org/getcorgi/corgi)
[![Coverage Status](https://coveralls.io/repos/github/getcorgi/corgi/badge.svg?branch=master)](https://coveralls.io/github/getcorgi/corgi?branch=master)
[![Dependency status](https://david-dm.org/getcorgi/corgi.svg)](https://david-dm.org/getcorgi/corgi)
[![Netlify Status](https://api.netlify.com/api/v1/badges/986629ff-987f-4ef0-b373-6767a4e5a79e/deploy-status)](https://app.netlify.com/sites/corgi/deploys)

Free and secure video hangouts for everyone.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [Yarn](https://yarnpkg.com/lang/en/docs/install/)
- [Firebase account](https://firebase.google.com/)

## Installation

### Clone repository:

```sh
$ git clone https://github.com/getcorgi/corgi.git
```

### Install dependencies:

```sh
$ yarn
```

### Setup Firebase

This app uses [Firebase](https://firebase.google.com/) as a database to persist some basic user and group information. Create an account and setup the following database rules:

```
{
  "rules": {
    "peers": {
      "$uid": {
        "$id": {
          ".read": "auth != null && auth.uid == $uid",
          ".write": "auth != null && auth.uid == $uid",
          "$otherUid": {
            "$otherId": {
              ".read": "auth != null && auth.uid == $otherUid",
              ".write": "auth != null && auth.uid == $otherUid",
              "sdp": {
                ".validate": "newData.isString() && newData.val().length < 4000"
              },
              "type": {
                ".validate": "newData.val() == 'offer' || newData.val() == 'answer' || newData.val() == 'error'"
              },
              "$other": { ".validate": false }
            }
          }
        }
      }
    }
  }
}
```

### Setup environment variables

In the root directory create a `.env.local` file with the following variables:
These can be found settings -> general in the firebase console.

```
REACT_APP_API_KEY=<firebaseApiKey>
REACT_APP_AUTH_DOMAIN=<firebaseAuthDomain>
REACT_APP_DATABASE_URL=<firebaseDatabaseUrl>
REACT_APP_PROJECT_ID=<firebaseProjectId>
REACT_APP_STORAGE_BUCKET=<firebaseStorageBucket>
REACT_APP_MESSAGING_SENDER_ID=<firebaseMessagingSenderId>
REACT_APP_ID=<firebaseAppId>
REACT_APP_MEASUREMENT_ID=<firebaseMeasurementId>
REACT_APP_SOCKET_SERVER="http://localhost:8080"
```

## Available Scripts

### `yarn start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `yarn lint`

Lints the files.

### `yarn test`

Launches the test runner in the interactive watch mode.

### `yarn build`

Builds the app for production to the `build` folder.

### `yarn storybook`

Runs storybook on [http://localhost:9009](http://localhost:9009).
