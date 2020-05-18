import { action } from '@storybook/addon-actions';
import { number, object, text } from '@storybook/addon-knobs';
import React from 'react';

import ActivityTabs from './ActivityTabs';

export default {
  title: 'Group/ActivityTabs',
};

export const Default = () => {
  const activeActivityIndex = number('props.activeActivityIndex', 0);
  const activeViewId = text('props.activeViewId', 'activeViewId');
  const activities = object('props.activities', [
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
  ]);
  const setActiveViewId = action('props.setActiveViewId');

  return (
    <ActivityTabs
      activeActivityIndex={activeActivityIndex}
      activeViewId={activeViewId}
      activities={activities}
      setActiveViewId={setActiveViewId}
    />
  );
};
