import React, { useEffect, useRef, useState } from 'react';
import { Redirect } from 'react-router-dom';

import useAddPeer from '../../lib/hooks/useAddPeer';
import useCurrentUser from '../../lib/hooks/useCurrentUser';
import useGroup from '../../lib/hooks/useGroup';
import usePeers, { PeersDocumentData } from '../../lib/hooks/usePeers';
import Board from './Board';
import useAddMessage from '../../lib/hooks/useAddMessage';
import useMessages, { MessagesDocumentData } from '../../lib/hooks/useMessages';
import useRemovePeer from '../../lib/hooks/useRemovePeer';

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
  const removePeer = useRemovePeer();
  const peers = usePeers(groupId);
  const addMessage = useAddMessage();
  const messages = useMessages(groupId);
  const currentUser = useCurrentUser();
  const userIdRef = useRef(currentUser.uid);
  const [streams, setStreams] = useState<Set<MediaStream>>(new Set([]));
  const isConnected = useRef(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  const connections = useRef<Map<string, RTCPeerConnection>>(new Map([]));

  const localStream = useRef<MediaStream>();

  useEffect(() => {
    const track = localStream.current?.getVideoTracks()[0];
    if (!track) return;

    if (isCameraOff) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isCameraOff]);

  useEffect(() => {
    const track = localStream.current?.getAudioTracks()[0];
    if (!track) return;

    if (isMuted) {
      track.enabled = false;
    } else {
      track.enabled = true;
    }
  }, [isMuted]);

  useEffect(() => {
    (async () => {
      const stream = await getLocalStream();

      localStream.current = stream;
      setStreams(prevStreams => new Set([...prevStreams, stream]));
    })();
    return function cleanup() {
      removePeer({ groupId, userId: userIdRef.current });
    };
  }, []);

  async function sendMessage(message: string) {
    console.log('sendMessage');
    const ref = await addMessage({
      userId: userIdRef.current,
      groupId,
      message,
    });
    ref.delete();
  }

  async function onMessageReceived({ message, userId }: MessagesDocumentData) {
    if (!message) return;

    try {
      const msg = JSON.parse(message);

      const peerConnection = connections.current.get(userId);
      console.log(peerConnection, connections.current);
      console.log(userId, userIdRef.current, message, msg);

      if (userId !== userIdRef.current && peerConnection) {
        console.log('onMessageReceived');
        if (msg.ice) {
          peerConnection.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg.sdp.type === 'offer') {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(msg.sdp),
          );
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);

          sendMessage(JSON.stringify({ sdp: peerConnection.localDescription }));
        } else if (msg.sdp.type === 'answer') {
          await peerConnection.setRemoteDescription(
            new RTCSessionDescription(msg.sdp),
          );
        }
      }
    } catch (e) {
      console.error(e);
    }
  }
  /**
   *  peers collection
   *  document peer
   *  id
   *
   *  messages collection
   *
   */

  async function onNewPeerAdded(peer: PeersDocumentData) {
    if (connections.current.get(peer.id) || peer.id === userIdRef.current)
      return;

    const peerConnection = new RTCPeerConnection(configuration);
    connections.current.set(peer.id, peerConnection);

    peerConnection.onicecandidate = event =>
      event.candidate
        ? sendMessage(JSON.stringify({ ice: event.candidate }))
        : console.log('Sent All Ice');

    peerConnection.ontrack = event => {
      console.log('remote stream', event);

      setStreams(prevStreams => new Set([...prevStreams, event.streams[0]]));
    };

    localStream.current?.getTracks().forEach(track => {
      if (!localStream.current) return;

      peerConnection.addTrack(track, localStream.current);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    sendMessage(JSON.stringify({ sdp: peerConnection.localDescription }));
  }

  useEffect(() => {
    const unsubscribe = messages?.snapshot
      ?.docChanges()
      .forEach(function(change) {
        if (change.type === 'added' && isConnected.current) {
          // console.log('added');
          onMessageReceived(change.doc.data() as MessagesDocumentData);
        }
      });

    return () => {
      if (unsubscribe) {
        //@ts-ignore
        unsubscribe();
      }
    };
  }, [messages.snapshot]);

  useEffect(() => {
    if (isConnected.current) {
      console.log('ON CONNECTE');
      peers.data.forEach(onNewPeerAdded);
    }
  }, [JSON.stringify(peers.data), isConnected.current]);

  const hangup = () => {};

  async function call() {
    isConnected.current = true;
    peers.data.forEach(onNewPeerAdded);

    if (userIdRef.current) {
      await addPeer({ groupId, userId: userIdRef.current });
    }
  }

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const toggleAudio = () => {
    setIsMuted(!isMuted);
  };

  if (peers.data && !peers.loading && !peers.error) {
    return (
      <>
        {peers.data.map(peer => (
          <p>{peer.id}</p>
        ))}
        ME: {userIdRef.current}
        <Board call={call} hangup={hangup} streams={streams} />
        {isMuted && 'muted'}
        <button onClick={toggleAudio}>mute</button>
        <button onClick={toggleCamera}>camera</button>
      </>
    );
  }

  return null;
}
