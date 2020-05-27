import {
  Link as MuiLink,
  styled,
  Theme,
  Tooltip as MuiTooltip,
  withStyles,
} from '@material-ui/core';

export const Header = styled('header')({
  position: 'absolute',
  padding: '20px',
  top: 0,
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

export const Tooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: 12,
    backgroundColor: theme.palette.primary.main,
    fontWeight: 700,
    color: 'white',
  },
  arrow: {
    color: theme.palette.primary.main,
  },
}))(MuiTooltip);
