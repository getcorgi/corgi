import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <Typography component="div">
      <Box display="flex" height="100%" width="300" fontSize="h6.fontSize">
        Oops... The link you are trying to reach cannot be found
      </Box>
      <Box>
        <Link to="/">Go Home</Link>
      </Box>
    </Typography>
  );
}
