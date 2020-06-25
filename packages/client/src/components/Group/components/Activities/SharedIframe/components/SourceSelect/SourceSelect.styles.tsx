import {
  InputBase,
  ListSubheader as MuiListSubheader,
  MenuItem as MuiMenuItem,
  Select as MuiSelect,
  styled,
} from '@material-ui/core';

export const Select = styled(MuiSelect)({
  fontSize: '14px',
  fontWeight: 'bold',
  padding: '0 30px 0 0',
  background: 'none',
  marginRight: '8px',
  '&::before': {
    display: 'none',
  },
  '&::after': {
    display: 'none',
  },
  '& .MuiSelect-select': {
    padding: 0,
  },
});

export const Input = styled(InputBase)({
  width: '100%',
  paddingLeft: '16px',
  fontSize: '14px',
});

export const MenuItem = styled(MuiMenuItem)({
  width: '280px',
});

export const ListSubheader = styled(MuiListSubheader)({
  lineHeight: '16px',
  marginTop: '8px',
});

export const Form = styled('form')({
  width: '100%',
  display: 'flex',
});
