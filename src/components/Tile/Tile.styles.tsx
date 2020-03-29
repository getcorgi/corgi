import { styled } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';

const MutedLink = styled(Link)({
  color: 'inherit',
  textDecoration: 'none',

  '&:focus': {
    textDecoration: 'none',
  },
  '&:hover': {
    textDecoration: 'none',
  },
  '&:visited': {
    textDecoration: 'none',
  },
  '&:link': {
    textDecoration: 'none',
  },
  '&:active': {
    textDecoration: 'none',
  },
});

export { MutedLink };
