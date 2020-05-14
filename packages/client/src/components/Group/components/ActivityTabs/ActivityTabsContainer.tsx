import React from 'react';

import { builtInActivities } from '../../../../constants';
import useActivities from '../../../../lib/hooks/useActivities';
import ActivityTabs from './ActivityTabs';

interface Props {
  activeViewId: string;
  setActiveViewId: (id: string) => void;
}

export default function ActivityTabsContainer(props: Props) {
  const { data, loading } = useActivities();
  if (loading) return null;

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
