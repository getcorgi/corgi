import { Box } from '@material-ui/core';
import { styled } from '@material-ui/core/styles';

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
