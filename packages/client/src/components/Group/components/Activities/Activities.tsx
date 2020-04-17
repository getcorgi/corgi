import { AppBar, Box, Icon, Tab, Tabs, Tooltip } from '@material-ui/core';
import React from 'react';

import useActivities from '../../../../lib/hooks/useActivities';

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

export default function Activities(props: Props) {
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
    <Box
      width="250px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <AppBar position="static" color="default">
        <Tabs
          value={activeActivityIndex}
          onChange={(event, value) => {
            props.setActiveViewId(`${value}`);
          }}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          {activities.map(activity => {
            return (
              <Tooltip
                key={activity.id}
                title={activity.name}
                aria-label={activity.name}
              >
                <Tab
                  style={{ minWidth: 50, width: 50 }}
                  aria-label={activity.name}
                  icon={<Icon>{activity.icon}</Icon>}
                  value={activity.id}
                  {...a11yProps(activity.id)}
                />
              </Tooltip>
            );
          })}
        </Tabs>
      </AppBar>
    </Box>
  );
}
