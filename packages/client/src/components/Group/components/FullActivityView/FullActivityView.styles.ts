import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const FullActivityView = styled(Box)`
  &::before {
    content: "";
    background-image: url("${process.env.PUBLIC_URL}/inspiration-geometry.png");
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    opacity: 0.2;
    background-size: 500px;
    pointer-events: none;
    z-index: -1;
  }
`;

export const Controls = styled.div.withConfig({
  shouldForwardProp: prop => !['isIdle'].includes(prop),
})`
  align-items: center;
  pointer-events: none;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  height: 96px;
  padding: 8px;
  width: 100%;
  position: absolute;
  transition: transform 0.2s;
  transform: ${({ isIdle }: { isIdle: boolean }) =>
    `translateY(${isIdle ? '96px' : 0})`};
  background-image: -webkit-linear-gradient(
    bottom,
    rgba(0, 0, 0, 0.4) 0,
    rgba(0, 0, 0, 0.2) 25%,
    rgba(0, 0, 0, 0) 100%
  );
`;

export const ActionWrapper = styled(Box)`
  pointer-events: all;
`;
