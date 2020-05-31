import { Box, RootRef } from '@material-ui/core';
import React, { useMemo, useRef } from 'react';
import useBindKeys from 'react-use-bind-keys';

const keyMap = {
  MUTE: ['meta+d', 'd+meta'],
  DISABLE_VIDEO: ['meta+e', 'e+meta'],
};

const createKeyHandlers = (params: {
  toggleIsMuted: () => void;
  toggleCamera: () => void;
}) => {
  return {
    MUTE: () => {
      params.toggleIsMuted();
    },
    DISABLE_VIDEO: () => {
      params.toggleCamera();
    },
  };
};

interface Props {
  toggleCamera: () => void;
  toggleIsMuted: () => void;
}
const Hotkeys: React.FC<Props> = props => {
  const hotkeyWrapperRef = useRef(null);
  const keyHandlers = useMemo(
    () =>
      createKeyHandlers({
        toggleCamera: props.toggleCamera,
        toggleIsMuted: props.toggleIsMuted,
      }),
    [props.toggleIsMuted, props.toggleCamera],
  );

  useBindKeys(hotkeyWrapperRef, {
    keyMap,
    keyHandlers,
    preventDefault: true,
  });

  return (
    <RootRef rootRef={hotkeyWrapperRef}>
      <Box width="100%" height="100%" css={{ outline: 'none' }}>
        {props.children}
      </Box>
    </RootRef>
  );
};

export default Hotkeys;
