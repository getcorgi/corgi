import {
  Box,
  Card,
  createStyles,
  FormControl as MUIFormControl,
  makeStyles,
  Theme,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const Controls = styled(Box)({
  position: 'absolute',
  display: 'flex',
  bottom: 0,
  justifyContent: 'space-between',
  width: '100%',
  padding: '4px',
});

export const VideoCard = styled(Card)({
  position: 'relative',
  borderRadius: '8px',
});

export const SettingsPopover = styled(Box)({
  width: '280px',
});

export const FormControl = styled(MUIFormControl)({
  width: '100%',
});

export const Gradient = styled('div')({
  position: 'absolute',
  width: '100%',
  height: '80px',
  bottom: 0,
  backgroundImage:
    '-webkit-linear-gradient(bottom,rgba(0,0,0,0.7) 0,rgba(0,0,0,0.3) 50%,rgba(0,0,0,0) 100%)',
});

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    Avatar: {
      backgroundColor: theme.palette.secondary.main,
      color: theme.palette.secondary.contrastText,
    },
  }),
);
