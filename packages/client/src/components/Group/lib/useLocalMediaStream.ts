import { useContext, useEffect, useRef, useState } from 'react';

import { MediaSettingsContext } from '../../MediaSettingsProvider';

const stopStream = (localStream?: MediaStream) => {
  localStream?.getTracks().forEach(track => {
    track.stop();
  });
};

export default function useMediaStream() {
  const [localStream, setLocalStream] = useState<MediaStream>();
  const { mediaConstraints } = useContext(MediaSettingsContext);
  const mediaConstraintsRef = useRef(mediaConstraints);

  useEffect(() => {
    (async () => {
      const micPermissions = await navigator.permissions.query({
        name: 'microphone',
      });
      const cameraPermissions = await navigator.permissions.query({
        name: 'camera',
      });
      const isMissingPermissions =
        (!micPermissions && !cameraPermissions) ||
        (micPermissions?.state === 'denied' &&
          cameraPermissions?.state === 'denied');

      // TODO: @orrybaram - add a modal here
      if (isMissingPermissions) {
        alert('Camera and microphone are blocked, please update permissions.');
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      // No input devices available
      if (
        (!mediaConstraints.audio && !mediaConstraints.video) ||
        (localStream && mediaConstraintsRef.current === mediaConstraints)
      )
        return;

      mediaConstraintsRef.current = mediaConstraints;

      try {
        const stream = await navigator.mediaDevices.getUserMedia(
          mediaConstraints,
        );
        setLocalStream(stream);
      } catch (e) {
        console.log(e);
        // Handle Error
      }
    })();

    return function onUnmount() {
      if (localStream) {
        stopStream(localStream);
      }
    };
  }, [mediaConstraints, localStream]);

  return {
    localStream,
    setLocalStream,
  };
}
