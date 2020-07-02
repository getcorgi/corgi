import {
  InputBase,
  ListSubheader as MuiListSubheader,
  MenuItem as MuiMenuItem,
} from '@material-ui/core';
import styled from 'styled-components';

import { backgroundColor } from '../../../../../../lib/theme';

export const Input = styled(InputBase)`
  width: 100%;
  margin-left: 16px;

  & > input {
    background: ${backgroundColor[700]};
    border-radius: 4px;
    padding: 4px 12px;
    font-size: 12px;
  }
`;

export const MenuItem = styled(MuiMenuItem)`
  width: 280px;
`;

export const ListSubheader = styled(MuiListSubheader)`
  line-height: 16px;
  margin-top: 8px;
`;

export const Form = styled.form`
  width: 100%;
  display: flex;
`;

export const Title = styled.div`
  font-weight: bold;
  font-size: 12px;
`;
