import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import useGroup from '../../lib/hooks/useGroup';
import useUpdateGroup from '../../lib/hooks/useUpdateGroup';
import useUser from '../../lib/hooks/useUser';
import { MeContext } from '../MeProvider';
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
  const history = useHistory();
  const me = useContext(MeContext);
  const { update: updateUser } = useUser();

  const [userName, setUserName] = useState(me?.name || '');

  const { localStream } = useMediaStream();
  const { toggleIsMuted, isMuted } = useMute(localStream);
  const { toggleCamera, isCameraOff } = useToggleCamera(localStream);

  const { connect, disconnect, isConnected, streams, users } = useSocketHandler(
    {
      groupId,
      localStream,
    },
  );

  useEffect(() => {
    if (me?.name && !userName) {
      setUserName(me.name);
    }
  }, [me, userName]);

  function onJoinCall() {
    connect({ name: userName, isMuted });
  }

  const onHangup = () => {
    disconnect();
    history.push('/');
  };

  const onUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.value;
    setUserName(name);
    updateUser({ name, id: me?.id });
  };

  if (!isConnected || localStream === undefined) {
    return (
      <Preview
        groupName={group.data?.name || ''}
        isCameraOff={isCameraOff}
        isMuted={isMuted}
        onJoin={onJoinCall}
        onUserNameChange={onUserNameChange}
        stream={localStream}
        toggleCamera={toggleCamera}
        toggleIsMuted={toggleIsMuted}
        userName={userName}
        users={users}
      />
    );
  }

  if (isConnected && localStream !== undefined) {
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
