import { ButtonBase, Typography } from '@material-ui/core';
import theme from 'lib/theme';
import styled from 'styled-components';

export const ActivityChoice = styled(ButtonBase)<{ isActive: boolean }>`
  border: 1px solid ${theme.palette.primary.main};
  border-radius: 8px;
  padding: 24px;
  font-weight: bold;

  ${({ isActive }) =>
    isActive &&
    `
    background: ${theme.palette.primary.main};
  `}
`;

export const GroupLabel = styled(Typography)`
  font-weight: bold;
  text-transform: uppercase;
  margin-bottom: 16px;
`;

export const DialogTitle = styled(Typography)`
  font-weight: bold;
`;

export const DialogSubtitle = styled(Typography)`
  color: ${theme.palette.grey[400]};
`;

export const FooterText = styled(Typography)`
  color: ${theme.palette.grey[400]};
`;
