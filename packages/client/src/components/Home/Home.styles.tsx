import Box from '@material-ui/core/Box';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../lib/theme';

export const FormWrapper = styled(Box)({});

export const Form = styled('form')({
  background: backgroundColor['800'],
  padding: '24px',
  width: '600px',
  borderRadius: '8px',
});
