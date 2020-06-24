import {
  Badge,
  Box,
  Divider,
  Drawer,
  IconButton,
  Tooltip,
} from '@material-ui/core';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import ChatIcon from '@material-ui/icons/Chat';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import StopScreenShareIcon from '@material-ui/icons/StopScreenShare';
import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import useSound from 'use-sound';

import theme from '../../../../lib/theme';
import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import useActivities, {
  activeActivityIdsState,
  ActivityId,
} from '../Activities/lib/useActivities';
import ActivityTabs from '../ActivityTabs';
import Chat from '../Chat';
import ChatSnackbar from '../ChatSnackbar/ChatSnackbar';
import MediaSettingsModal from '../MediaSettingsModal';
import OverflowMenu from './components/OverflowMenu';
import * as S from './Sidebar.styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawer: {
      width: S.DRAWER_WIDTH,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerPaper: {
      background: '#17181b',
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
  isAdmin: boolean;
  isSharingScreen: boolean;
  messages: Message[];
  sendMessage: (msg: string) => void;
  setUnreadMessageCount: (count: number) => void;
  toggleIsSharingScreen: () => void;
  unreadMessageCount: number;
}

export default function SideBar(props: Props) {
  const classes = useStyles();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { toggleActivity } = useActivities();

  const toggleDrawerOpen = () => {
    props.setUnreadMessageCount(0);
    setIsDrawerOpen(!isDrawerOpen);
  };

  const [chatReceivedBoop] = useSound(
    `${process.env.PUBLIC_URL}/chatSound.mp3`,
    { volume: 0.25 },
  );

  useEffect(() => {
    if (props.unreadMessageCount > 0 && !isDrawerOpen) {
      chatReceivedBoop({});
    }
  }, [chatReceivedBoop, isDrawerOpen, props.unreadMessageCount]);

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="right"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isDrawerOpen,
          [classes.drawerClose]: !isDrawerOpen,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: isDrawerOpen,
            [classes.drawerClose]: !isDrawerOpen,
          }),
        }}
      >
        {isDrawerOpen && (
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

        {!isDrawerOpen && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={props.isAdmin ? 'space-between' : 'flex-end'}
            height="100%"
          >
            {props.isAdmin && (
              // <ActivityTabs
              //   setActiveViewId={props.setActiveViewId}
              //   activeViewId={props.activeViewId}
              // />
              <button onClick={toggleActivity(ActivityId.SharedIframe)}>
                iframe
              </button>
            )}

            <Box display="flex" flexDirection="column" alignItems="center">
              <Box mb={theme.spacing(0.2)}>
                <Tooltip title="Chat" placement="left">
                  <IconButton onClick={toggleDrawerOpen}>
                    <Badge
                      color="secondary"
                      badgeContent={props.unreadMessageCount}
                    >
                      <ChatIcon />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
              <Box mb={theme.spacing(0.2)}>
                <Box>
                  <OverflowMenu
                    toggleIsSharingScreen={props.toggleIsSharingScreen}
                    isSharingScreen={props.isSharingScreen}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Drawer>
      <S.Main isDrawerOpen={isDrawerOpen}>{props.children}</S.Main>
      <ChatSnackbar
        sholdShowSnackbar={!isDrawerOpen}
        messages={props.messages}
        handleOpenChatWindow={toggleDrawerOpen}
      />
    </>
  );
}
