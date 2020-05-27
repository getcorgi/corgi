import { Box, Link as MuiLink } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../lib/theme';

export const FormWrapper = styled(Box)({});

export const Form = styled('form')({
  background: backgroundColor['800'],
  padding: '24px',
  width: '600px',
  borderRadius: '8px',
  boxShadow: '0 7px 12px 15px #00000054',
});

export const Hero = styled('div')({
  height: '100%',
  width: '100%',
  backgroundImage: ({ path }: { path: string }) => `url("${path}")`,
  backgroundSize: 'cover',
});

export const Citation = styled(MuiLink)({
  color: 'white',
  padding: '0 4px',
  borderRadius: '10px',
  backgroundColor: 'black',
  position: 'absolute',
  left: '8px',
  bottom: '8px',
});
