import Box from '@material-ui/core/Box';
import { SocketContext } from 'components/Group/lib/SocketContext';
import { currentUserState } from 'lib/hooks/useUser';
import throttle from 'lodash.throttle';
import React, { useContext, useEffect, useRef } from 'react';
import { useRecoilValue } from 'recoil';

const STROKE_WIDTH = 5;

interface Point {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
  color?: string;
}

const hex2rgba = (hex: string, alpha = 1) => {
  const [r, g, b] = hex.match(/\w\w/g)?.map(x => parseInt(x, 16));
  return `rgba(${r},${g},${b},${alpha})`;
};

export default function Draw() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const me = useRecoilValue(currentUserState);
  const fadeOutTimers = useRef<{ [key: string]: number }>({});

  const { socket } = useContext(SocketContext);

  useEffect(() => {
    const canvas = canvasRef.current;

    const lineOpacities = {
      [me.id]: 1,
    };

    if (!canvas) return;
    const context = canvas.getContext('2d');

    if (!context) return;

    const points: { [id: string]: Point[] } = {};

    let isDrawing = false;

    const current = {
      x: -1,
      y: -1,
    };

    function handleDrawLine(point: Point) {
      const color = me?.color?.['200'] || '#FFFFFF';

      if (points[me.id]) {
        points[me.id] = [...points[me.id], { ...point, color }];
      } else {
        points[me.id] = [{ ...point, color }];
      }

      if (!canvas) return;

      const w = canvas.width;
      const h = canvas.height;

      socket.emit('DrawActivity::drawing', {
        id: me.id,
        point: {
          x0: point.x0 / w,
          y0: point.y0 / h,
          x1: point.x1 / w,
          y1: point.y1 / h,
          color,
        },
      });

      socket.emit('DrawActivity::drawing', { id: me.id, point });
    }

    function animateLines() {
      if (!context || !canvas) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      Object.entries(points).forEach(([id, userPoints]) => {
        userPoints.forEach(point => {
          context.beginPath();
          context.moveTo(point.x0, point.y0);
          context.lineTo(point.x1, point.y1);
          context.lineCap = 'round';
          context.lineJoin = 'round';
          context.strokeStyle = hex2rgba(
            point.color || '#FFFFFF',
            lineOpacities[id],
          );
          context.lineWidth = STROKE_WIDTH;
          context.stroke();
          context.closePath();
        });
      });
    }

    function onMouseDown(e: MouseEvent) {
      isDrawing = true;
      current.x = e.clientX;
      current.y = e.clientY;
    }

    function handleFadeOutLines(userId: string) {
      if (!lineOpacities[userId]) {
        lineOpacities[userId] = 1;
      }

      lineOpacities[userId] -= 0.05;

      if (lineOpacities[userId] <= 0) {
        clearInterval(fadeOutTimers.current[userId]);
        fadeOutTimers.current[userId] = -1;
        points[userId] = [];
        lineOpacities[userId] = 1;
      }
    }

    function onMouseUp(e: MouseEvent) {
      if (!isDrawing) {
        return;
      }

      fadeOutTimers.current[me.id] = setInterval(
        () => handleFadeOutLines(me.id),
        100,
      );

      isDrawing = false;
      handleDrawLine({
        x0: current.x,
        y0: current.y,
        x1: e.clientX,
        y1: e.clientY,
      });
    }

    function onMouseMove(e: MouseEvent) {
      if (!isDrawing) {
        return;
      }

      clearInterval(fadeOutTimers.current[me.id]);
      fadeOutTimers.current[me.id] = -1;
      lineOpacities[me.id] = 1;

      handleDrawLine({
        x0: current.x,
        y0: current.y,
        x1: e.clientX,
        y1: e.clientY,
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

    function animate() {
      requestAnimationFrame(animate);
      animateLines();
    }

    socket.on(
      'DrawActivity::receivedDrawing',
      ({ id, point }: { id: string; point: Point }) => {
        const w = canvas.width;
        const h = canvas.height;

        const newPoint = {
          x0: point.x0 * w,
          y0: point.y0 * h,
          x1: point.x1 * w,
          y1: point.y1 * h,
          color: point.color,
        };

        if (points[id]) {
          points[id] = [...points[id], newPoint];
        } else {
          points[id] = [newPoint];
        }

        if (!fadeOutTimers.current[id]) {
          fadeOutTimers.current[id] = setInterval(
            () => handleFadeOutLines(id),
            100,
          );
        } else {
          lineOpacities[id] = 1;
          clearInterval(fadeOutTimers.current[id]);
          fadeOutTimers.current[id] = setInterval(
            () => handleFadeOutLines(id),
            100,
          );
        }
      },
    );

    onResize();
    animate();

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
