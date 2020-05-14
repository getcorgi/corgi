import React from 'react';

import useActivities from '../../../../lib/hooks/useActivities';
import ActivityTabs from './ActivityTabs';

interface Props {
  activeViewId: string;
  setActiveViewId: (id: string) => void;
}

export default function ActivityTabsContainer(props: Props) {
  const { data, loading } = useActivities();

  if (loading) {
    return null;
  }
  const builtInActivities = [
    {
      id: '0',
      name: 'Basic Video',
      icon: 'video_call',
    },
    {
      id: '1',
      name: 'Browse Together',
      icon: 'web',
    },
  ];

  const activities = [...builtInActivities, ...data];
  const activeActivityIndex = activities.findIndex(
    activity => activity.id === props.activeViewId,
  );

  return (
    <ActivityTabs
      activeActivityIndex={activeActivityIndex}
      activeViewId={props.activeViewId}
      activities={activities}
      setActiveViewId={props.setActiveViewId}
    />
  );
}
