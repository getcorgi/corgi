import {
  Box,
  Card,
  Theme,
  Tooltip as MuiTooltip,
  withStyles,
} from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

export const LocalVideo = styled(Card)({
  position: 'absolute',
  bottom: '16px',
  right: '16px',
  width: '150px',
});

export const EmptyMessage = styled('div')({
  color: 'rgba(255, 255, 255, 0.7)',
  fontWeight: 600,
  fontSize: '30px',
});

export const LinkWrapper = styled(Box)({
  background: '#33325a',
  padding: '2px 10px',
  borderRadius: '8px',
  cursor: 'pointer',
});

export const Tooltip = withStyles((theme: Theme) => ({
  tooltip: {
    fontSize: 16,
    backgroundColor: '#67e4a6',
    color: '#1d4632',
  },
}))(MuiTooltip);
