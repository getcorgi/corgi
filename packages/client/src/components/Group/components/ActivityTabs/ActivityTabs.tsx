import {
  createStyles,
  Icon,
  makeStyles,
  Tab,
  Tabs,
  Theme,
  Tooltip,
} from '@material-ui/core';
import React from 'react';

import useActivities from '../../../../lib/hooks/useActivities';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    tabsIndicator: {
      left: 0,
      right: 'unset',
    },
  }),
);

function a11yProps(index: number | string) {
  return {
    id: `scrollable-force-tab-${index}`,
    'aria-controls': `scrollable-force-tabpanel-${index}`,
  };
}

interface Props {
  activeViewId: string;
  setActiveViewId: (id: string) => void;
}

export default function ActivityTabs(props: Props) {
  const { data, loading } = useActivities();
  const classes = useStyles();

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
    <Tabs
      value={activeActivityIndex}
      onChange={(event, value) => {
        props.setActiveViewId(`${value}`);
      }}
      orientation="vertical"
      indicatorColor="primary"
      textColor="primary"
      classes={{
        indicator: classes.tabsIndicator,
      }}
    >
      {activities.map(activity => {
        return (
          <Tooltip
            key={activity.id}
            title={activity.name}
            aria-label={activity.name}
            placement="left"
          >
            <Tab
              style={{ minWidth: 50, width: '100%', padding: 16 }}
              aria-label={activity.name}
              icon={<Icon>{activity.icon}</Icon>}
              value={activity.id}
              {...a11yProps(activity.id)}
            />
          </Tooltip>
        );
      })}
    </Tabs>
  );
}
