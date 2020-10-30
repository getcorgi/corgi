import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';
import theme from 'lib/theme';

export const ContentWrapper = styled(Box)({
  height: '100%',
  maxHeight: '100%',
  overflow: 'auto',
  position: 'relative',
  pointerEvents: (props: { isResizing: boolean }) =>
    props.isResizing ? 'none' : 'all',
  userSelect: (props: { isResizing: boolean }) =>
    props.isResizing ? 'none' : 'all',
});

interface DraggerProps {
  width: number;
}

interface DraggerWrapperProps {
  width: number;
  bgcolor: string;
}

const getPaddedWidth = (width: number) => {
  return width + width * 0.8;
};

export const Dragger = styled('div')({
  cursor: 'col-resize',
  width: (props: DraggerProps) => getPaddedWidth(props.width),
  left: (props: DraggerProps) =>
    -(getPaddedWidth(props.width) - props.width) / 2,
  height: '100%',
  position: 'absolute',
  zIndex: 1,
});

export const DraggerWrapper = styled('div')({
  position: 'relative',
  height: '100%',
  background: (props: DraggerWrapperProps) => props.bgcolor,
  width: (props: DraggerWrapperProps) => props.width,
  '&:hover': {
    background: theme.palette.primary.main,
  },
});
