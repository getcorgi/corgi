import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import { appConfig } from 'lib/constants';
import useUser from 'lib/hooks/useUser';
import theme from 'lib/theme';
import React, { Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ErrorPage from './components/ErrorPage';
import { FirebaseProvider } from './components/Firebase';
import Group from './components/Group';
import Home from './components/Home';

const App: React.FC = () => {
  useUser();

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Corgi</title>
        <meta name="description" content="Get a conversation started" />
      </Helmet>

      <Router>
        <Route exact path="/" component={Home} />
        <Route exact path="/groups/:groupId" component={Group} />
        <Route exact path="/error" component={ErrorPage} />
      </Router>
    </>
  );
};

const Root = () => (
  <RecoilRoot>
    <ThemeProvider theme={theme}>
      <FirebaseProvider config={appConfig}>
        <Suspense fallback="loading...">
          <CssBaseline />
          <App />
        </Suspense>
      </FirebaseProvider>
    </ThemeProvider>
  </RecoilRoot>
);

export default Root;
