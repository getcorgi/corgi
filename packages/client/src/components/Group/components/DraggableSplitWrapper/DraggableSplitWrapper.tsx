import { Box } from '@material-ui/core';
import * as React from 'react';

import * as S from './DraggableSplitWrapper.styles';

interface Props {
  right: React.ReactNode;
  left: React.ReactNode;
  draggerSize: number;
  minAsideWidth: string;
  maxAsideWidth: string;
  draggerColor: string;
}

const defaultProps = {
  draggerSize: 5,
  minAsideWidth: '15%',
  maxAsideWidth: '35%',
  draggerColor: 'rgba(0, 0, 0, 0.4)',
};

function DraggableSplitWrapper(props: Props) {
  const wrapperRef = React.useRef<HTMLDivElement>(null);
  const draggerRef = React.useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = React.useState(false);
  const [mainWidth, setMainWidth] = React.useState<number | undefined>();

  const handleMouseMove = React.useCallback(
    (e: MouseEvent) => {
      // We don't want to do anything if we aren't resizing.
      if (!isResizing) {
        return;
      }
      if (!draggerRef.current) return;
      setMainWidth(e.clientX);
    },
    [isResizing],
  );

  const handleStartResizing = React.useCallback(() => {
    setIsResizing(true);
  }, []);
  const handleStopResizing = React.useCallback(() => {
    setIsResizing(false);
  }, []);

  React.useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleStopResizing);
    window.addEventListener('mouseleave', handleStopResizing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleStopResizing);
      window.removeEventListener('mouseleave', handleStopResizing);
    };
  }, [handleMouseMove, handleStopResizing]);

  const asideWidth = mainWidth
    ? (wrapperRef.current?.offsetWidth || 0) - mainWidth
    : // default start percentage
      '12.5%';

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      position="relative"
      // @ts-ignore
      ref={wrapperRef}
    >
      <Box display="flex" height="100%">
        <S.ContentWrapper flexGrow={1} isResizing={isResizing}>
          {props.left}
        </S.ContentWrapper>

        <Box
          position="relative"
          height="100%"
          width={props.draggerSize}
          bgcolor={props.draggerColor}
        >
          <S.Dragger
            onMouseDown={handleStartResizing}
            ref={draggerRef}
            width={props.draggerSize}
          />
        </Box>

        <S.ContentWrapper
          width={asideWidth}
          isResizing={isResizing}
          maxWidth={props.maxAsideWidth}
          minWidth={props.minAsideWidth}
        >
          {props.right}
        </S.ContentWrapper>
      </Box>
    </Box>
  );
}

DraggableSplitWrapper.defaultProps = defaultProps;

export default DraggableSplitWrapper;
