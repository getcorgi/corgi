import CssBaseline from '@material-ui/core/CssBaseline';
import { ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { RecoilRoot } from 'recoil';

import ErrorPage from './components/ErrorPage';
import { FirebaseProvider } from './components/Firebase';
import Group from './components/Group';
import Home from './components/Home';
import { MeProvider } from './components/MeProvider';
import { appConfig } from './constants';
import theme from './lib/theme';

const App: React.FC = () => {
  return (
    <RecoilRoot>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Corgi</title>
        <meta name="description" content="Get a conversation started" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FirebaseProvider config={appConfig}>
          <MeProvider>
            <Router>
              <Route exact path="/" component={Home} />
              <Route exact path="/groups/:groupId" component={Group} />
              <Route exact path="/error" component={ErrorPage} />
            </Router>
          </MeProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </RecoilRoot>
  );
};

export default App;
