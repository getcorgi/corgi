import { Fade, styled, Zoom } from '@material-ui/core';
import React, { useEffect, useState } from 'react';

const S = {
  VideoOverlay: styled('div')({
    bottom: 0,
    height: '100%',
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    width: '100%',
    background: 'rgba(106, 105, 192, 0.4)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: ({ size }: { size: number }) => `${size / 2}px`,
  }),
};

interface Props {
  text: string;
  size: number;
}

export default function VideoOverlay(props: Props) {
  const [isIn, setIsIn] = useState(true);

  useEffect(() => {
    window.setTimeout(() => {
      setIsIn(false);
    }, 4500);
  }, []);

  return (
    <Fade in={isIn}>
      <S.VideoOverlay size={props.size}>
        <Zoom in={isIn}>
          <div>{props.text}</div>
        </Zoom>
      </S.VideoOverlay>
    </Fade>
  );
}
