import { configure } from '@storybook/react';
import { addDecorator } from '@storybook/react';
import StoryRouter from 'storybook-react-router';
import requireContext from 'require-context.macro';

addDecorator(StoryRouter());

// automatically import all files ending in *.stories.{ts,tsx}
configure(requireContext('../src/', true, /\.stories\.tsx?$/), module);
