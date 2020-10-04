import React, { useEffect, useState } from 'react';

import * as S from './AudioVisualizer.styles';

interface Props {
  mediaStream: MediaStream;
}

const getMidFrequencyVelocity = (freq: number) => {
  const velocity = freq / 2;
  if (velocity < 30) {
    return 30;
  }
  if (velocity > 50) {
    return 50;
  }
  return velocity;
};
const getHighFrequencyVelocity = (freq: number) => {
  const velocity = freq * 2;
  if (velocity < 50) {
    return 50;
  }
  if (velocity > 70) {
    return 70;
  }
  return velocity;
};

export default function AudioVisualizer(props: Props) {
  const [velocity, setVelocity] = useState({ mid: 0, high: 0 });

  useEffect(() => {
    if (!props.mediaStream) return;

    const audioContext = new (window.AudioContext ||
      /* @ts-ignore */
      window.webkitAudioContext)();
    const audioSource = audioContext.createMediaStreamSource(props.mediaStream);
    const analyser = audioContext.createAnalyser();
    audioSource.connect(analyser);
    analyser.fftSize = 32;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    let raf: number;

    function draw() {
      raf = requestAnimationFrame(draw);
      analyser.getByteFrequencyData(dataArray);
      setVelocity(v => {
        return {
          mid: getMidFrequencyVelocity(dataArray[7]) / 2,
          high: getHighFrequencyVelocity(dataArray[12]) / 2,
        };
      });
    }

    draw();

    return function cleanup() {
      cancelAnimationFrame(raf);
    };
  }, [props.mediaStream]);

  return (
    <S.AudioSignal>
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r={velocity.mid} fill="#67e4a6" />
        <circle
          cx="50"
          cy="50"
          r={velocity.high}
          stroke="white"
          strokeWidth="4"
          strokeOpacity="0.5"
          fillOpacity="0"
        />
      </svg>
    </S.AudioSignal>
  );
}
