import './App.css';

import CssBaseline from '@material-ui/core/CssBaseline';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import ErrorPage from './components/ErrorPage';
import { FirebaseProvider } from './components/Firebase';
import Group from './components/Group';
import Groups from './components/Groups';
import { appConfig } from './constants';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const App: React.FC = () => {
  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <FirebaseProvider config={appConfig}>
          <Router>
            <Route exact path="/" component={Groups} />
            <Route exact path="/groups/:groupId" component={Group} />
            <Route exact path="/error" component={ErrorPage} />
          </Router>
        </FirebaseProvider>
      </ThemeProvider>
    </>
  );
};

export default App;
