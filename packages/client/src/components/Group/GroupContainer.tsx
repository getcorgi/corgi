import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';

import useGroup from '../../lib/hooks/useGroup';
import { currentUserState } from '../../lib/hooks/useUser';
import Hotkeys from '../Hotkeys/Hotkeys';
import { MediaSettingsContext } from '../MediaSettingsProvider';
import BasicView from './components/BasicView';
import FullActivityView from './components/FullActivityView';
import MediaSettingsModal from './components/MediaSettingsModal';
import PermissionsAlert from './components/PermissionsAlert';
import Preview from './components/Preview';
import Sidebar from './components/Sidebar';
import VideoView from './components/VideoView';
import { groupAdminIdState, groupIdState } from './lib/GroupState';
import useIsAdmin from './lib/useIsAdmin';
import useMediaStream from './lib/useLocalMediaStream';
import useMute from './lib/useMute';
import useScreenShareSocketHandler from './lib/useScreenShareSocketHandler';
import useSocketHandler from './lib/useSocketHandler';
import useToggleCamera from './lib/useToggleCamera';

export default function GroupContainer(
  props: RouteComponentProps<{ groupId: string }>,
) {
  const groupId = props.match.params.groupId;
  const group = useGroup(groupId);
  const setGroupAdminId = useSetRecoilState(groupAdminIdState);
  const setGroupId = useSetRecoilState(groupIdState);

  const [me, updateMe] = useRecoilState(currentUserState);

  const { isPermissonAlertOpen, handleClosePermissionAlert } = useContext(
    MediaSettingsContext,
  );
  const isAdmin = useIsAdmin();

  const creatorId = Object.keys(group?.data?.roles.byId || {})[0];

  useEffect(() => {
    setGroupAdminId(creatorId);
  }, [creatorId, setGroupAdminId]);

  useEffect(() => {
    setGroupId(groupId);
  }, [groupId, setGroupId]);

  const [userName, setUserName] = useState(me?.name || '');

  const { localStream, localStreamStatus } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);
  const userData = useMemo(
    () => ({
      ...me,
      name: userName,
      isMuted,
      isCameraOff,
    }),
    [userName, isMuted, isCameraOff, me],
  );

  const {
    isInRoom,
    joinRoom,
    leaveRoom,
    messages,
    sendMessage,
    setUnreadMessageCount,
    streams,
    unreadMessageCount,
    users,
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
    isScreenSharePeerConnected: isSharingScreen,
  } = useScreenShareSocketHandler({
    groupId,
    userData,
  });

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
    updateMe(me => ({ ...me, name }));
  };

  const renderCommon = () => (
    <>
      <Helmet>
        <title>
          {`${unreadMessageCount ? `(${unreadMessageCount}) ` : ''}${
            group.data?.name ? `${group.data?.name} - ` : ''
          }`}
          Corgi
        </title>
        <meta
          name="description"
          content={`Join my room - ${group.data?.name}`}
        />
      </Helmet>

      <PermissionsAlert
        isOpen={isPermissonAlertOpen}
        handleClose={handleClosePermissionAlert}
      />
      <MediaSettingsModal />
    </>
  );

  if (!me) {
    return null;
  }

  if (!isInRoom || localStream === undefined) {
    return (
      <Hotkeys toggleCamera={toggleCamera} toggleIsMuted={toggleIsMuted}>
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
      </Hotkeys>
    );
  }

  const toggleIsSharingScreen = () => {
    if (isSharingScreen) {
      return disconnectScreenShare();
    }
    connectScreenShare();
  };

  if (isInRoom && localStream !== undefined) {
    return (
      <Hotkeys toggleCamera={toggleCamera} toggleIsMuted={toggleIsMuted}>
        {renderCommon()}
        <Sidebar
          unreadMessageCount={unreadMessageCount}
          isAdmin={isAdmin}
          messages={messages}
          sendMessage={sendMessage}
          setUnreadMessageCount={setUnreadMessageCount}
          isSharingScreen={isSharingScreen}
          toggleIsSharingScreen={toggleIsSharingScreen}
        >
          <Switch>
            <Route path={`${props.match.url}/:activityId`}>
              <FullActivityView
                isCameraOff={isCameraOff}
                isMuted={isMuted}
                onHangup={onHangup}
                streams={streams}
                toggleCamera={toggleCamera}
                toggleIsMuted={toggleIsMuted}
                toggleIsSharingScreen={toggleIsSharingScreen}
                messages={messages}
                localStream={localStream}
              >
                {({ streams, messages }) => {
                  return (
                    <BasicView
                      localStream={localStream}
                      me={me}
                      streams={streams}
                      messages={messages}
                    />
                  );
                }}
              </FullActivityView>
            </Route>
            <Route path={props.match.url}>
              <VideoView
                isAdmin={isAdmin}
                isCameraOff={isCameraOff}
                isMuted={isMuted}
                isSharingScreen={isSharingScreen}
                onHangup={onHangup}
                streams={streams}
                toggleCamera={toggleCamera}
                toggleIsMuted={toggleIsMuted}
                toggleIsSharingScreen={toggleIsSharingScreen}
                messages={messages}
                sendMessage={sendMessage}
                setUnreadMessageCount={setUnreadMessageCount}
                unreadMessageCount={unreadMessageCount}
              >
                {({ streams, messages }) => {
                  return (
                    <BasicView
                      localStream={localStream}
                      me={me}
                      streams={streams}
                      messages={messages}
                    />
                  );
                }}
              </VideoView>
            </Route>
          </Switch>
        </Sidebar>
      </Hotkeys>
    );
  }

  return null;
}
