import { Box, Divider, Drawer, IconButton, Tooltip } from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import clsx from 'clsx';
import React from 'react';

import theme, { backgroundColor } from '../../../../lib/theme';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import Chat from '../Chat';
import MediaSettingsPopover from '../MediaSettingsPopover';
import * as S from './Sidebar.styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: S.DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerPaper: {
      background: backgroundColor[800],
      borderLeft: 'none',
    },
    drawerOpen: {
      width: S.DRAWER_WIDTH,
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
      width: S.CLOSED_DRAWER_WIDTH,
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
            <S.Header>
              <Box p={theme.spacing(0.1)}>
                <Tooltip title="Close" placement="left">
                  <IconButton size="small" onClick={toggleDrawerOpen}>
                    <ChevronRightIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Divider />
            </S.Header>
            <S.ChatWrapper>
              <Chat
                shouldFocusInput={true}
                messages={props.messages}
                sendMessage={props.sendMessage}
              />
            </S.ChatWrapper>
          </Box>
        )}

        {!isOpen && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="flex-end"
            height="100%"
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={theme.spacing(0.2)}>
                <Tooltip title="Chat" placement="left">
                  <IconButton onClick={toggleDrawerOpen}>
                    <ChatIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box mb={theme.spacing(0.2)}>
                <Tooltip title="Settings" placement="left">
                  <Box>
                    <MediaSettingsPopover />
                  </Box>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
      <S.Main isDrawerOpen={isOpen}>{props.children}</S.Main>
    </>
  );
}
