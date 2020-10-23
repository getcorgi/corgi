import theme from 'lib/theme';
import styled from 'styled-components';

const HEADER_HEIGHT = 44;
export const DRAWER_WIDTH = 360;
export const CLOSED_DRAWER_WIDTH = 60;

export const ChatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  height: calc(100% - ${HEADER_HEIGHT}px);
`;

export const Header = styled.div`
  position: sticky;
  height: ${HEADER_HEIGHT}px;
`;

export const Main = styled.main.withConfig({
  shouldForwardProp: prop => !['isChatDrawerOpen'].includes(prop),
})`
  flex-grow: 1;
  height: 100%;
  margin-right: ${CLOSED_DRAWER_WIDTH};
  width: ${({ isChatDrawerOpen }: { isChatDrawerOpen: boolean }) =>
    `calc(100% - ${isChatDrawerOpen ? DRAWER_WIDTH : CLOSED_DRAWER_WIDTH}px)`};

  transition: width ${theme.transitions.duration.enteringScreen}ms;
`;
