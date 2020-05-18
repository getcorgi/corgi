import React from 'react';
import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import requireContext from 'require-context.macro';
import { createMuiTheme } from '@material-ui/core/styles';
import { muiTheme } from 'storybook-addon-material-ui';
import { withKnobs } from '@storybook/addon-knobs';
import { CssBaseline } from '@material-ui/core';

const theme = {
  palette: {
    type: 'dark',
  },
};

addDecorator(withKnobs());
addDecorator(StoryRouter());
addDecorator(storyFn => (
  <>
    <CssBaseline />
    {storyFn()}
  </>
));
addDecorator(muiTheme([theme]));
addDecorator(Story => <Story />);

// automatically import all files ending in *.stories.{ts,tsx}
configure(requireContext('../src/', true, /\.stories\.tsx?$/), module);
