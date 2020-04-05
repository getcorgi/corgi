import React, { useEffect, useState } from 'react';

import useGroup from '../../lib/hooks/useGroup';
import Preview from './components/Preview';
import Group from './Group';
import useMediaStream from './lib/useLocalMediaStream';
import useMute from './lib/useMute';
import useSocketHandler from './lib/useSocketHandler';
import useToggleCamera from './lib/useToggleCamera';

interface Props {
  match: {
    params: {
      groupId: string;
    };
  };
}
export default function GroupContainer(props: Props) {
  const groupId = props.match.params.groupId;
  const group = useGroup(groupId);

  const [userName, setUserName] = useState('');

  const {
    localStream,
    currentVideoDevice,
    setCurrentVideoDevice,
    videoDevices,
    audioDevices,
  } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);

  const { connect, disconnect, isConnected, streams, users } = useSocketHandler(
    {
      groupId,
      localStream,
    },
  );

  function onJoinCall() {
    connect({ name: userName });
  }

  const onHangup = () => {
    disconnect();
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(event.target.value);
  };

  const onSelectVideoDevice = (
    e: React.ChangeEvent<{ name?: string | undefined; value: unknown }>,
  ) => {
    setCurrentVideoDevice(e.target.value as string);
  };

  if (!isConnected && localStream) {
    return (
      <>
        <Preview
          groupName={group.data?.name || ''}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          onJoin={onJoinCall}
          stream={localStream}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          userName={userName}
          onUserNameChange={onUserNameChange}
          users={users}
          onSelectVideoDevice={onSelectVideoDevice}
          videoDevices={videoDevices}
          currentVideoDevice={currentVideoDevice}
        />
      </>
    );
  }

  if (localStream) {
    return (
      <>
        <Group
          onHangup={onHangup}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          localStream={localStream}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          userName={userName}
        />
      </>
    );
  }

  return null;
}
