import React, { useState } from 'react';

import useGroup from '../../lib/hooks/useGroup';
import useUpdateGroup from '../../lib/hooks/useUpdateGroup';
import BasicView from './components/BasicView';
import BrowseTogether from './components/BrowseTogetherView';
import Preview from './components/Preview';
import VideoView from './components/VideoView';
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
  const updateGroup = useUpdateGroup();

  const [userName, setUserName] = useState('');

  const {
    localStream,
    currentVideoDevice,
    setCurrentVideoDevice,
    videoDevices,
    // audioDevices,
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
    console.log('PREVIEW', Boolean(!isConnected), Boolean(localStream));
    return (
      <>
        <Preview
          currentVideoDevice={currentVideoDevice}
          groupName={group.data?.name || ''}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          onJoin={onJoinCall}
          onSelectVideoDevice={onSelectVideoDevice}
          onUserNameChange={onUserNameChange}
          stream={localStream}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          userName={userName}
          users={users}
          videoDevices={videoDevices}
        />
      </>
    );
  }

  if (localStream) {
    console.log('VIDEO VIEW', typeof group.data?.activityId);
    return (
      <>
        <VideoView
          onHangup={onHangup}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          setActiveViewId={id => {
            updateGroup({
              groupId,
              activityId: id,
            });
          }}
          activeViewId={group.data?.activityId || '0'}
        >
          {({ streams }) => {
            switch (group.data?.activityId) {
              case '1': {
                return (
                  <BrowseTogether
                    localStream={localStream}
                    userName={userName}
                    streams={streams}
                    activityUrl={group.data?.activityUrl}
                    updateActivityUrl={value =>
                      updateGroup({ groupId, activityUrl: value })
                    }
                  />
                );
              }
              case '0':
              default: {
                return (
                  <BasicView
                    localStream={localStream}
                    userName={userName}
                    streams={streams}
                  />
                );
              }
            }
          }}
        </VideoView>
      </>
    );
  }

  return null;
}
