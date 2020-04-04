import { useEffect, useState } from 'react';

async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return stream;
}

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();

  useEffect(() => {
    let stream: MediaStream;
    (async () => {
      stream = await getLocalStream();

      setLocalStream(stream);
    })();
  }, []);

  return { localStream };
}
