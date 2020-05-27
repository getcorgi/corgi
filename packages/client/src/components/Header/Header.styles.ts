import { Link as MuiLink, styled } from '@material-ui/core';

export const Header = styled('header')({
  position: 'absolute',
  padding: '20px',
  width: '100%',
  backgroundImage:
    '-webkit-linear-gradient(top, rgba(0,0,0, 0.9) 0,rgba(0,0,0,0.4) 50%,rgba(0,0,0,0) 100%)',
});

export const Link = styled(MuiLink)({
  color: 'white',
  fontSize: '34px',
  letterSpacing: '-2px',
  '&:hover': {
    textDecoration: 'none',
  },
});
