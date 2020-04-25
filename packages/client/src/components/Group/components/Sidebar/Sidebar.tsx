import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import React from 'react';

import { backgroundColor } from '../../../../lib/theme';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import Chat from '../Chat';

const DRAWER_WIDTH = 240;
const CLOSED_DRAWER_WIDTH = 60;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerPaper: {
      background: backgroundColor[800],
    },
    drawerOpen: {
      width: DRAWER_WIDTH,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: CLOSED_DRAWER_WIDTH,
    },
    content: {
      flexGrow: 1,
      height: '100%',
      marginRight: CLOSED_DRAWER_WIDTH,
    },
  }),
);

interface Props {
  children: React.ReactNode;
  messages: Message[];
  sendMessage: (msg: string) => void;
}

export default function SideBar(props: Props) {
  const classes = useStyles();
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDrawerOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="right"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isOpen,
          [classes.drawerClose]: !isOpen,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: isOpen,
            [classes.drawerClose]: !isOpen,
          }),
        }}
      >
        {isOpen && (
          <Box height="100%" display="flex" flexDirection="column">
            <Box display="flex" justifyContent="flex-start">
              <IconButton onClick={toggleDrawerOpen}>
                <ChevronRightIcon />
              </IconButton>
              <Divider />
            </Box>
            <Box p="8px">
              <Chat messages={props.messages} sendMessage={props.sendMessage} />
            </Box>
          </Box>
        )}

        {!isOpen && (
          <Box
            display="flex"
            alignItems="flex-end"
            height="100%"
            justifyContent="space-between"
          >
            <List>
              <ListItem button onClick={toggleDrawerOpen}>
                <ListItemIcon>
                  <ChatIcon />
                </ListItemIcon>
                <ListItemText primary="test" />
              </ListItem>
            </List>
          </Box>
        )}
      </Drawer>
      <main className={classes.content}>{props.children}</main>
    </>
  );
}
