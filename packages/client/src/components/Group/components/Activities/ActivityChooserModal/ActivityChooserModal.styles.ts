import { ButtonBase, Typography } from '@material-ui/core';
import styled from 'styled-components';

import theme from '../../../../../lib/theme';

export const ActivityChoice = styled(ButtonBase)`
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 8px;
  padding: 24px;
  font-weight: bold;
`;

export const GroupLabel = styled(Typography)`
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 16px;
`;
