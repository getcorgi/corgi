import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';

import useGroup from '../../lib/hooks/useGroup';
import useUpdateGroup from '../../lib/hooks/useUpdateGroup';
import { MediaSettingsContext } from '../MediaSettingsProvider';
import { MeContext } from '../MeProvider';
import ActivityView from './components/ActivityView';
import BasicView from './components/BasicView';
import BrowseTogether from './components/BrowseTogetherView';
import PermissionsAlert from './components/PermissionsAlert';
import Preview from './components/Preview';
import VideoView from './components/VideoView';
import useMediaStream from './lib/useLocalMediaStream';
import useMute from './lib/useMute';
import useScreenShare from './lib/useScreenShare';
import useScreenShareSocketHandler from './lib/useScreenShareSocketHandler';
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
  const { me, updateMe } = useContext(MeContext);
  const { isPermissonAlertOpen, handleClosePermissionAlert } = useContext(
    MediaSettingsContext,
  );

  const isAdmin = Boolean(
    group.data?.roles.editors.some(editor => editor === me?.firebaseAuthId),
  );

  const [userName, setUserName] = useState(me?.name || '');

  const { localStream, setLocalStream, localStreamStatus } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);
  const userData = useMemo(
    () => ({
      name: userName,
      isMuted,
      isCameraOff,
      color: me?.color,
    }),
    [userName, isMuted, isCameraOff, me],
  );

  const {
    joinRoom,
    leaveRoom,
    isInRoom,
    streams,
    users,
    messages,
    sendMessage,
  } = useSocketHandler({
    groupId,
    localStream,
    isMuted,
    isCameraOff,
    userData,
  });

  const {
    disconnectScreenShare,
    connectScreenShare,
    isScreenSharePeerConnected,
  } = useScreenShareSocketHandler({
    groupId,
    localScreenShareStream: localStream,
    userData,
  });

  // const { isSharingScreen, toggleIsSharingScreen } = useScreenShare({
  //   localStream,
  //   setLocalStream,
  // });

  useEffect(() => {
    if (me?.name && !userName) {
      setUserName(me.name);
    }
  }, [me, userName]);

  function onJoinCall() {
    joinRoom();
  }

  const onHangup = () => {
    leaveRoom();
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setUserName(name);
    updateMe({ name, id: me?.id });
  };

  const renderCommon = () => (
    <>
      <Helmet>
        <title>{`Corgi${
          group.data?.name ? ` - ${group.data?.name}` : ''
        }`}</title>
        <meta
          name="description"
          content={`Join my room - ${group.data?.name}`}
        />
      </Helmet>

      <PermissionsAlert
        isOpen={isPermissonAlertOpen}
        handleClose={handleClosePermissionAlert}
      />
    </>
  );

  console.log('STREAMS', streams);

  if (!isInRoom || localStream === undefined) {
    return (
      <>
        {renderCommon()}
        <Preview
          groupName={group.data?.name || ''}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          me={me}
          onJoin={onJoinCall}
          onUserNameChange={onUserNameChange}
          stream={localStream}
          streamStatus={localStreamStatus}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          userName={userName}
          users={users}
        />
      </>
    );
  }

  const toggleIsSharingScreen = () => {
    if (isScreenSharePeerConnected) {
      return disconnectScreenShare();
    }
    connectScreenShare();
  };

  if (isInRoom && localStream !== undefined) {
    const setActiveView = (id: string) => {
      updateGroup({
        groupId,
        activityId: id,
      });
    };

    return (
      <>
        {renderCommon()}
        <VideoView
          activeViewId={group.data?.activityId || '0'}
          isAdmin={isAdmin}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          isSharingScreen={isScreenSharePeerConnected}
          onHangup={onHangup}
          setActiveViewId={setActiveView}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          toggleIsSharingScreen={toggleIsSharingScreen}
          messages={messages}
          sendMessage={sendMessage}
        >
          {({ streams }) => {
            switch (group.data?.activityId) {
              case '1': {
                return (
                  <BrowseTogether
                    localStream={localStream}
                    me={me}
                    streams={streams}
                    activityUrl={group.data?.activityUrl}
                    updateActivityUrl={value =>
                      updateGroup({ groupId, activityUrl: value })
                    }
                  />
                );
              }
              case '0': {
                return (
                  <BasicView
                    localStream={localStream}
                    me={me}
                    streams={streams}
                  />
                );
              }
              default: {
                return (
                  <ActivityView
                    id={group.data?.activityId || '0'}
                    localStream={localStream}
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
