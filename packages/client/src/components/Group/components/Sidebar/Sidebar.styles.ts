import { styled } from '@material-ui/core';

import theme from '../../../../lib/theme';

const HEADER_HEIGHT = 44;
export const DRAWER_WIDTH = 360;
export const CLOSED_DRAWER_WIDTH = 60;

export const ChatWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  height: `calc(100% - ${HEADER_HEIGHT}px)`,
});

export const Header = styled('div')({
  position: 'sticky',
  height: `${HEADER_HEIGHT}px`,
});

export const Main = styled('main')({
  flexGrow: 1,
  height: '100%',
  marginRight: CLOSED_DRAWER_WIDTH,
  width: ({ isDrawerOpen }: { isDrawerOpen: boolean }) =>
    `calc(100% - ${isDrawerOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH}px)`,

  transition: `width ${theme.transitions.duration.enteringScreen}ms`,
});
