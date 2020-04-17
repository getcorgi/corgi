import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { Helmet } from 'react-helmet';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ErrorPage from './components/ErrorPage';
import { FirebaseProvider } from './components/Firebase';
import Group from './components/Group';
import Home from './components/Home';
import { MediaSettingsProvider } from './components/MediaSettingsProvider';
import { MeProvider } from './components/MeProvider';
import { appConfig, backgroundColor } from './constants';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6a6abf',
    },
    background: {
      default: backgroundColor[700],
      paper: backgroundColor[700],
    },
  },
});

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Corgi</title>
        <meta name="description" content="Get a conversation started" />
      </Helmet>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FirebaseProvider config={appConfig}>
          <MeProvider>
            <MediaSettingsProvider>
              <Router>
                <Route exact path="/" component={Home} />
                <Route exact path="/groups/:groupId" component={Group} />
                <Route exact path="/error" component={ErrorPage} />
              </Router>
            </MediaSettingsProvider>
          </MeProvider>
        </FirebaseProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
