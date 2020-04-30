import Peer from 'simple-peer';

import { SetStreamsState } from '../types';
import { Connections } from '../types';

export default function onPeerCreated({
  peerId,
  peer,
  setStreams,
  connections,
}: {
  peerId: string;
  peer: Peer.Instance;
  setStreams: SetStreamsState;
  connections: Connections;
}) {
  peer.on('connect', function() {
    console.log('connected', peerId);
  });

  peer.on('error', function(err) {
    console.log('error', err);
  });

  peer.on('stream', function(stream: MediaStream) {
    const isMuted = connections.get(peerId)?.userData?.isMuted;
    const isCameraOff = connections.get(peerId)?.userData?.isCameraOff;

    console.log(connections.get(peerId)?.userData);

    setStreams(prevStreams => {
      stream.getAudioTracks().forEach(track => {
        track.enabled = !isMuted;
      });

      stream.getVideoTracks().forEach(track => {
        track.enabled = !isCameraOff;
      });

      return {
        ...prevStreams,
        [peerId]: { userId: peerId, stream },
      };
    });
  });

  peer.on('close', function() {
    console.log('close peer', peerId);
    setStreams(prevStreams => {
      const newStreams = { ...prevStreams };
      delete newStreams[peerId];

      return newStreams;
    });
  });

  peer.on('data', function(data: string) {
    const { message, id } = JSON.parse(data) as {
      message: { isMuted: boolean; isCameraOff: boolean };
      id: string;
    };

    return setStreams(prevStreams => {
      const newStream = prevStreams[id]?.stream;

      if (!newStream) return prevStreams;

      newStream.getAudioTracks().forEach(track => {
        track.enabled = !message.isMuted;
      });
      newStream.getVideoTracks().forEach(track => {
        track.enabled = !message.isCameraOff;
      });

      return {
        ...prevStreams,
        [id]: { ...prevStreams[id], stream: newStream },
      };
    });
  });
}
