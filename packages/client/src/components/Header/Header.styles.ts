import { Link as MuiLink, styled } from '@material-ui/core';

export const Header = styled('header')({
  position: 'absolute',
  background: 'black',
  padding: '20px',
});

export const Link = styled(MuiLink)({
  '&:hover': {
    textDecoration: 'none',
  },
});
