import Box from '@material-ui/core/Box';
import { styled } from '@material-ui/core/styles';

import { backgroundColor } from '../../constants';

export const FormWrapper = styled(Box)({});

export const Form = styled('form')({
  background: backgroundColor['900'],
  padding: '24px',
  width: '400px',
});
