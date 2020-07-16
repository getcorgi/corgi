import { Box } from '@material-ui/core';
import styled from 'styled-components';

export const Draw = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: transparent;
  position: absolute;
  width: 100%;
  top: 0;
  left: 0;
  cursor: url("${process.env.PUBLIC_URL}/pencil-cursor.png") 6 30, auto;
`;
