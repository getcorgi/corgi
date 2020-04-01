import React, { useEffect, useRef, useState } from 'react';

import useAddMessage from '../../lib/hooks/useAddMessage';
import useAddPeer from '../../lib/hooks/useAddPeer';
import useCurrentUser from '../../lib/hooks/useCurrentUser';
import useGroup from '../../lib/hooks/useGroup';
import useMessages, { MessagesDocumentData } from '../../lib/hooks/useMessages';
import usePeers, { PeersDocumentData } from '../../lib/hooks/usePeers';
import useRemovePeer from '../../lib/hooks/useRemovePeer';
import Preview from './components/Preview';
import Group from './Group';
import useUpdatePeerStatus from '../../lib/hooks/useUpdatePeerStatus';

interface Props {
  match: {
    params: {
      groupId: string;
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

export default function GroupContainer(props: Props) {
  const groupId = props.match.params.groupId;
  const group = useGroup(groupId);
  const addPeer = useAddPeer();
  const removePeer = useRemovePeer();
  const peers = usePeers(groupId);
  const addMessage = useAddMessage();
  const messages = useMessages(groupId);
  const currentUser = useCurrentUser();
  const userIdRef = useRef(currentUser.uid);
  const [streams, setStreams] = useState<{ [key: string]: { userId: string, stream: MediaStream } }>({});
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const myPeerData = peers.data.find(peer => peer.id === userIdRef.current);
  const isConnected = Boolean(myPeerData);
  useUpdatePeerStatus({ isConnected, groupId });

  const connections = useRef<Map<string, RTCPeerConnection>>(new Map([]));

  const localStream = useRef<MediaStream>();

  async function onPeerRemoved(peer: PeersDocumentData) {
    removePeer({ groupId, userId: peer.id });
    const peerConnection = connections.current.get(peer.id);
    console.log('B. peerConnection', { peerConnection, connections, peer })

    if (!peerConnection) return;

    peerConnection?.close();
    connections.current.delete(peer.id);
    setStreams((prevStreams) => {
      const newStreams = { ...prevStreams }
      delete newStreams[peer.id];
      console.log(newStreams);
      return newStreams;
    })
  }

  const hangup = () => {
    console.log('A. My Peer Data', myPeerData)
    if (!myPeerData) return;
    connections.current.forEach((connection) => connection.close());

    onPeerRemoved(myPeerData);
  };

  const toggleCamera = () => {
    setIsCameraOff(!isCameraOff);
  };

  const toggleIsMuted = () => {
    setIsMuted(!isMuted);
  };

  useEffect(() => {
    if (isConnected) {
      peers.data.forEach(onNewPeerAdded);
    }
  }, [isConnected, peers.data]);

  async function call() {
    peers.data.forEach(onNewPeerAdded);

    if (userIdRef.current) {
      await addPeer({ groupId, userId: userIdRef.current });
    }
  }

  useEffect(() => {
    const unsubscribe = messages?.snapshot
      ?.docChanges()
      .forEach(function (change) {
        if (change.type === 'added' && isConnected) {
          onMessageReceived(change.doc.data() as MessagesDocumentData);
        }
      });

    return () => {
      if (unsubscribe) {
        //@ts-ignore
        unsubscribe();
      }
    };
  }, [isConnected, messages, messages.snapshot]);

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
    let stream: MediaStream;
    (async () => {
      stream = await getLocalStream();

      localStream.current = stream;
    })();
    return function cleanup() {
      hangup();
    };
  }, [groupId]);

  async function sendMessage(message: string) {
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

      if (userId !== userIdRef.current && peerConnection) {
        if (msg.ice) {
          peerConnection.addIceCandidate(new RTCIceCandidate(msg.ice));
        } else if (msg?.sdp?.type === 'offer') {
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
      setStreams(prevStreams => ({ ...prevStreams, [peer.id]: { userId: peer.id, stream: event.streams[0] } }));
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
    const unsubscribe = peers?.snapshot?.docChanges().forEach(function (change) {
      if (change.type === 'added' && isConnected) {
        if (isConnected) {
          onNewPeerAdded(change.doc.data() as PeersDocumentData);
        }
      }
      if (
        change.type === 'removed') {
        onPeerRemoved(change.doc.data() as PeersDocumentData);
      }
      if (change.type === 'modified' && isConnected) {
        if (change.doc.data().state === 'offline') {
          onPeerRemoved(change.doc.data() as PeersDocumentData);
        }
      }
    }, [peers.snapshot]);

    return () => {
      if (unsubscribe) {
        //@ts-ignore
        unsubscribe();
      }
    };
  }, [peers.snapshot]);

  if (!isConnected && localStream.current) {
    return (
      <Preview
        onJoin={call}
        groupName={group.data?.name || ''}
        stream={localStream.current}
        toggleCamera={toggleCamera}
        toggleIsMuted={toggleIsMuted}
      />
    );
  }

  if (peers.data && !peers.loading && !peers.error && localStream.current) {
    return (
      <>
        {peers.data.map(peer => (
          <p>{peer.id}</p>
        ))}
        ME: {userIdRef.current}
        <Group
          hangup={hangup}
          localStream={{
            userId: userIdRef.current,
            stream: localStream.current
          }}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
        />
      </>
    );
  }

  return null;
}
