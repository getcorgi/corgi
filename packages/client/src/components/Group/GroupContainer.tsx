import React, { useContext, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useHistory } from 'react-router-dom';

import useGroup from '../../lib/hooks/useGroup';
import useUpdateGroup from '../../lib/hooks/useUpdateGroup';
import { MeContext } from '../MeProvider';
import ActivityView from './components/ActivityView';
import BasicView from './components/BasicView';
import BrowseTogether from './components/BrowseTogetherView';
import Preview from './components/Preview';
import VideoView from './components/VideoView';
import useMediaStream from './lib/useLocalMediaStream';
import useMute from './lib/useMute';
import useScreenShare from './lib/useScreenShare';
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
  const history = useHistory();
  const { me, updateMe } = useContext(MeContext);

  const isAdmin = Boolean(
    group.data?.roles.editors.some(editor => editor === me?.firebaseAuthId),
  );

  const [userName, setUserName] = useState(me?.name || '');

  const { localStream, setLocalStream } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);

  const { connect, disconnect, isConnected, streams, users } = useSocketHandler(
    {
      groupId,
      localStream,
      isMuted,
      isCameraOff,
    },
  );
  const { isSharingScreen, toggleIsSharingScreen } = useScreenShare({
    localStream,
    setLocalStream,
  });

  useEffect(() => {
    if (me?.name && !userName) {
      setUserName(me.name);
    }
  }, [me, userName]);

  function onJoinCall() {
    connect({ name: userName, isMuted, isCameraOff, color: me?.color });
  }

  const onHangup = () => {
    disconnect();
    history.push('/');
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setUserName(name);
    updateMe({ name, id: me?.id });
  };

  const renderMeta = () => (
    <Helmet>
      <title>{`Corgi${
        group.data?.name ? ` - ${group.data?.name}` : ''
      }`}</title>
      <meta name="description" content={`Join my room - ${group.data?.name}`} />
    </Helmet>
  );

  if (!isConnected || localStream === undefined) {
    return (
      <>
        {renderMeta()}
        <Preview
          groupName={group.data?.name || ''}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          me={me}
          onJoin={onJoinCall}
          onUserNameChange={onUserNameChange}
          stream={localStream}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          userName={userName}
          users={users}
        />
      </>
    );
  }

  if (isConnected && localStream !== undefined) {
    const setActiveView = (id: string) => {
      updateGroup({
        groupId,
        activityId: id,
      });
    };

    return (
      <>
        {renderMeta()}
        <VideoView
          activeViewId={group.data?.activityId || '0'}
          isAdmin={isAdmin}
          isCameraOff={isCameraOff}
          isMuted={isMuted}
          isSharingScreen={isSharingScreen}
          onHangup={onHangup}
          setActiveViewId={setActiveView}
          streams={streams}
          toggleCamera={toggleCamera}
          toggleIsMuted={toggleIsMuted}
          toggleIsSharingScreen={toggleIsSharingScreen}
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
