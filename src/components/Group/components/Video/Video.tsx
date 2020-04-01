import React, { useEffect, useRef } from 'react';

interface Props {
  playsInline?: boolean;
  autoPlay?: boolean;
  srcObject: MediaStream;
  isMuted?: boolean;
}

export default function(props: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.srcObject = props.srcObject;
    }
  }, [props.srcObject]);

  return (
    <video
      ref={videoRef}
      playsInline={props.playsInline}
      autoPlay={props.autoPlay}
      muted={props.isMuted}
    />
  );
}
