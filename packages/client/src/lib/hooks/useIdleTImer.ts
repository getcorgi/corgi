import { useEffect, useRef, useState } from 'react';

function addOrRemoveEvents(
  addOrRemove: 'addEventListener' | 'removeEventListener',
  handler: () => void,
) {
  window[addOrRemove]('load', handler);
  document[addOrRemove]('mousemove', handler);
  document[addOrRemove]('mousedown', handler);
  document[addOrRemove]('scroll', handler);
  document[addOrRemove]('keypress', handler);
}

export default function useIdleTimer(options: { wait: number }) {
  options = options || {};
  const [isIdle, setIsIdle] = useState(false);
  const timer = useRef<number>();

  useEffect(() => {
    const onUserIsIdle = () => {
      if (isIdle) return;
      setIsIdle(true);
    };

    const onUserIsActive = () => {
      setIsIdle(false);
      window.clearTimeout(timer?.current);
      timer.current = window.setTimeout(onUserIsIdle, options.wait);
    };

    addOrRemoveEvents('addEventListener', onUserIsActive);

    onUserIsActive();

    return function cleanup() {
      window.clearTimeout(timer.current);
      addOrRemoveEvents('removeEventListener', onUserIsActive);
    };
  }, [options.wait]); // eslint-disable-line

  return { isIdle };
}
