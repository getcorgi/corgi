import { useEffect, useState } from 'react';

interface Options {
  minWidth: number;
  maxWidth: number;
  draggerRef: HTMLDivElement | null;
}

export function useResizableContainer(options: Options) {
  const [isResizing, setIsResizing] = useState(false);
  const [width, setWidth] = useState<number | undefined>();

  useEffect(() => {
    if (!options.draggerRef) return;

    const handleMouseDown = () => {
      setIsResizing(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      // We don't want to do anything if we aren't resizing.
      if (!isResizing) {
        return;
      }

      const offsetRight =
        document.body.offsetWidth - (e.clientX - document.body.offsetLeft);

      if (offsetRight > options.minWidth && offsetRight < options.maxWidth) {
        setWidth(offsetRight);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return function cleanup() {
      if (!options.draggerRef) return;

      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, options.maxWidth, options.minWidth, options.draggerRef]);

  return { isResizing, width };
}
