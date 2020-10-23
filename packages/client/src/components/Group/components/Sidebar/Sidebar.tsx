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
import LibraryAddIcon from '@material-ui/icons/LibraryAdd';
import clsx from 'clsx';
import theme from 'lib/theme';
import React, { useEffect } from 'react';
import { atom, useRecoilState, useSetRecoilState } from 'recoil';
import useSound from 'use-sound';

import { Message } from '../../lib/useSocketHandler/lib/useChatMessages';
import ActivityChooserModal from '../Activities/ActivityChooserModal';
import { isActivityChooserModalOpenState } from '../Activities/ActivityChooserModal/ActivityChooserModal';
import Chat from '../Chat';
import ChatSnackbar from '../ChatSnackbar/ChatSnackbar';
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

export const isChatDrawerOpenState = atom({
  key: 'Group__Sidebar__isChatDrawerOpen',
  default: false,
});

export default function SideBar(props: Props) {
  const classes = useStyles();
  const [isChatDrawerOpen, setIsChatDrawerOpen] = useRecoilState(
    isChatDrawerOpenState,
  );
  const setIsActivityChooserModalOpen = useSetRecoilState(
    isActivityChooserModalOpenState,
  );

  const toggleDrawerOpen = () => {
    props.setUnreadMessageCount(0);
    setIsChatDrawerOpen(!isChatDrawerOpen);
  };

  const [chatReceivedBoop] = useSound(
    `${process.env.PUBLIC_URL}/chatSound.mp3`,
    { volume: 0.25 },
  );

  useEffect(() => {
    if (props.unreadMessageCount > 0 && !isChatDrawerOpen) {
      chatReceivedBoop({});
    }
  }, [chatReceivedBoop, isChatDrawerOpen, props.unreadMessageCount]);

  return (
    <>
      <Drawer
        variant="permanent"
        anchor="right"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: isChatDrawerOpen,
          [classes.drawerClose]: !isChatDrawerOpen,
        })}
        classes={{
          paper: clsx(classes.drawerPaper, {
            [classes.drawerOpen]: isChatDrawerOpen,
            [classes.drawerClose]: !isChatDrawerOpen,
          }),
        }}
      >
        {isChatDrawerOpen && (
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

        {!isChatDrawerOpen && (
          <Box
            display="flex"
            flexDirection="column"
            justifyContent={props.isAdmin ? 'space-between' : 'flex-end'}
            alignItems="center"
            height="100%"
          >
            {props.isAdmin && (
              <Box mt={theme.spacing(0.2)}>
                <Tooltip title="Add Activity" placement="left">
                  <IconButton
                    onClick={() => setIsActivityChooserModalOpen(true)}
                  >
                    <LibraryAddIcon />
                  </IconButton>
                </Tooltip>
              </Box>
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
      <S.Main isChatDrawerOpen={isChatDrawerOpen}>{props.children}</S.Main>

      <ActivityChooserModal />

      <ChatSnackbar
        sholdShowSnackbar={!isChatDrawerOpen}
        messages={props.messages}
        handleOpenChatWindow={toggleDrawerOpen}
      />
    </>
  );
}
