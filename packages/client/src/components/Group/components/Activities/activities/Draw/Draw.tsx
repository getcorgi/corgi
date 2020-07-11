import Box from '@material-ui/core/Box';
import { SocketContext } from 'components/Group/lib/SocketContext';
import { currentUserState } from 'lib/hooks/useUser';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

const STROKE_WIDTH = 5;

export default function Draw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const me = useRecoilValue(currentUserState);

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) return;
    const context = canvas.getContext('2d');

    if (!context) return;

    let isDrawing = false;

    const current = {
      x: -1,
      y: -1,
    };

    function drawLine({
      x0,
      y0,
      x1,
      y1,
      color,
      shouldEmit = false,
    }: {
      x0: number;
      y0: number;
      x1: number;
      y1: number;
      color?: string;
      shouldEmit?: boolean;
    }) {
      if (!context || !canvas) return;

      const lineColor = color || me?.color?.['200'] || 'white';

      context.beginPath();
      context.moveTo(x0, y0);
      context.lineTo(x1, y1);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = lineColor;
      context.lineWidth = STROKE_WIDTH;
      context.stroke();
      context.closePath();

      if (!shouldEmit) return;

      const w = canvas.width;
      const h = canvas.height;

      socket.emit('DrawActivity::drawing', {
        x0: x0 / w,
        y0: y0 / h,
        x1: x1 / w,
        y1: y1 / h,
        color: lineColor,
      });
    }

    function onMouseDown(e: MouseEvent) {
      isDrawing = true;
      current.x = e.clientX;
      current.y = e.clientY;
    }

    function onMouseUp(e: MouseEvent) {
      if (!isDrawing) {
        return;
      }
      isDrawing = false;
      drawLine({
        x0: current.x,
        y0: current.y,
        x1: e.clientX,
        y1: e.clientY,
        shouldEmit: true,
      });
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDrawing) {
        return;
      }
      drawLine({
        x0: current.x,
        y0: current.y,
        x1: e.clientX,
        y1: e.clientY,
        shouldEmit: true,
      });
      current.x = e.clientX;
      current.y = e.clientY;
    }

    function onResize() {
      if (!canvas || !wrapperRef.current) return;

      canvas.width = wrapperRef.current.offsetWidth;
      canvas.height = wrapperRef.current.offsetHeight;
    }

    const throttledMouseMove = throttle(onMouseMove, 10);

    onResize();

    socket.on(
      'DrawActivity::receivedDrawing',
      (data: {
        x0: number;
        y0: number;
        x1: number;
        y1: number;
        color: string;
      }) => {
        const w = canvas.width;
        const h = canvas.height;
        drawLine({
          x0: data.x0 * w,
          y0: data.y0 * h,
          x1: data.x1 * w,
          y1: data.y1 * h,
          color: data.color,
        });
      },
    );

    canvas.addEventListener('mousedown', onMouseDown, false);
    canvas.addEventListener('mouseup', onMouseUp, false);
    canvas.addEventListener('mouseout', onMouseUp, false);
    canvas.addEventListener('mousemove', throttledMouseMove, false);
    window.addEventListener('resize', onResize, false);

    return function cleanup() {
      canvas.removeEventListener('mousedown', onMouseDown, false);
      canvas.removeEventListener('mouseup', onMouseUp, false);
      canvas.removeEventListener('mouseout', onMouseUp, false);
      canvas.removeEventListener('mousemove', throttledMouseMove, false);
      window.removeEventListener('resize', onResize, false);
    };
  }, [me, me.color, socket]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100%"
      bgcolor="black"
      position="absolute"
      width="100%"
    >
      <div ref={wrapperRef} style={{ width: '100%', height: '100%' }}>
        <canvas style={{ width: '100%', height: '100%' }} ref={canvasRef} />
      </div>
    </Box>
  );
}
