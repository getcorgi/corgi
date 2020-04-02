import { Link } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import React from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
    logo: {
      color: theme.palette.primary.contrastText,
      '&:hover': {
        textDecoration: 'none',
      },
    },
  }),
);

const Header: React.FC = () => {
  const classes = useStyles();

  return (
    <header className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link href="/" className={classes.logo}>
              corgi
            </Link>
          </Typography>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default Header;
