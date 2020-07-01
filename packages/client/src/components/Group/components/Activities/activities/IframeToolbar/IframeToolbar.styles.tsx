import {
  InputBase,
  ListSubheader as MuiListSubheader,
  MenuItem as MuiMenuItem,
} from '@material-ui/core';
import styled from 'styled-components';

export const Input = styled(InputBase)`
  width: 100%;
  padding-left: 16px;
  font-size: 14px;
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
