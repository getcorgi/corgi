import Box from '@material-ui/core/Box';
import { styled } from '@material-ui/core/styles';
import { url } from 'inspector';

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
