import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

import useAddPeer from '../../lib/hooks/useAddPeer';
import useCurrentUser from '../../lib/hooks/useCurrentUser';
import useGroup from '../../lib/hooks/useGroup';
import usePeers, { PeersDocumentData } from '../../lib/hooks/usePeers';
import Board from './Board';

interface Props {
  match: {
    params: {
      boardId: string;
    };
  };
}

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
};

const configuration = {
  iceServers: [
    {
      urls: [
        'stun:stun1.l.google.com:19302',
        'stun:stun2.l.google.com:19302',
        'stun:stun.services.mozilla.com',
      ],
    },
  ],
};

const peerConnection = new RTCPeerConnection(configuration);

async function getLocalStream() {
  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  return stream;
}

export default function BoardContainer(props: Props) {
  const groupId = props.match.params.boardId;
  const addPeer = useAddPeer();
  const peers = usePeers(groupId);
  const currentUser = useCurrentUser();
  const userIdRef = useRef(currentUser.uid + Date.now());
  const [streams, setStreams] = useState<Set<MediaStream>>(new Set([]));
  const isConnected = useRef(false);

  const localStream = useRef<MediaStream>();

  peerConnection.onicecandidate = event =>
    event.candidate
      ? sendMessage(JSON.stringify({ ice: event.candidate }))
      : console.log('Sent All Ice');

  peerConnection.ontrack = event => {
    console.log('remote stream', event);

    setStreams(prevStreams => new Set([...prevStreams, event.streams[0]]));
  };

  useEffect(() => {
    (async () => {
      const stream = await getLocalStream();

      localStream.current = stream;
      setStreams(prevStreams => new Set([...prevStreams, stream]));
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });
    })();
  }, []);

  async function sendMessage(message: string) {
    const ref = await addPeer({ userId: userIdRef.current, groupId, message });
    ref.delete();
  }

  function onNewPeerAdded(peer: PeersDocumentData) {
    console.log({ peer });

    if (!peer) return;

    const msg = JSON.parse(peer.message);
    const senderId = peer.userId;

    console.log(senderId, userIdRef.current, peers, msg);

    if (senderId !== userIdRef.current) {
      if (msg.ice) {
        peerConnection.addIceCandidate(new RTCIceCandidate(msg.ice));
      } else if (msg.sdp.type === 'offer') {
        peerConnection
          .setRemoteDescription(new RTCSessionDescription(msg.sdp))
          .then(() => peerConnection.createAnswer())
          .then(answer => peerConnection.setLocalDescription(answer))
          .then(() =>
            sendMessage(
              JSON.stringify({ sdp: peerConnection.localDescription }),
            ),
          );
      } else if (msg.sdp.type === 'answer')
        peerConnection.setRemoteDescription(new RTCSessionDescription(msg.sdp));
    }
  }

  console.log(peers.snapshot);

  peers?.snapshot?.docChanges().forEach(function(change) {
    console.log(change);

    if (change.type === 'added' && isConnected.current) {
      console.log('added');
      onNewPeerAdded(change.doc.data() as PeersDocumentData);
    }
  });

  const hangup = () => {};

  function call() {
    peerConnection
      .createOffer()
      .then(offer => peerConnection.setLocalDescription(offer))
      .then(() => {
        isConnected.current = true;
        sendMessage(JSON.stringify({ sdp: peerConnection.localDescription }));
      });
  }

  console.log(streams);

  if (peers.data && !peers.loading && !peers.error) {
    return <Board call={call} hangup={hangup} streams={streams} />;
  }

  return null;
}
