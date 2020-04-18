import * as colors from '@material-ui/core/colors';
import { createMuiTheme } from '@material-ui/core/styles';

export const backgroundColor = {
  900: '#14151d',
  800: '#1e1f23',
  700: '#28292d',
};

export default createMuiTheme({
  palette: {
    type: 'dark',
    primary: {
      main: '#6a6abf',
    },
    background: {
      default: backgroundColor[700],
      paper: backgroundColor[700],
    },
  },
});

const COLORS = Object.keys(colors);

const hashString = (string: string): number => {
  let hash = 0;

  for (let i = 0; i < string.length; i += 1) {
    const charCode = string.charCodeAt(i);
    hash += charCode;
  }

  return hash;
};

const hashStringToArrayEntry = (string: string, array: any[]): any => {
  const hash = hashString(string);
  const index = hash % array.length;
  return array[index];
};

export const getColorFromHash = (hash: string) => {
  return hashStringToArrayEntry(hash, COLORS);
};
