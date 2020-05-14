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
  activeActivityIndex: number;
  activeViewId: string;
  activities: {
    icon: string;
    id: string;
    name: string;
  }[];
  setActiveViewId: (id: string) => void;
}

export default function ActivityTabs(props: Props) {
  const classes = useStyles();

  return (
    <Tabs
      classes={{ indicator: classes.tabsIndicator }}
      indicatorColor="primary"
      onChange={(event, value) => {
        props.setActiveViewId(`${value}`);
      }}
      orientation="vertical"
      textColor="primary"
      value={props.activeActivityIndex}
    >
      {props.activities.map(activity => {
        return (
          <Tooltip
            aria-label={activity.name}
            key={activity.id}
            placement="left"
            title={activity.name}
          >
            <Tab
              aria-label={activity.name}
              icon={<Icon>{activity.icon}</Icon>}
              style={{ minWidth: 50, width: '100%', padding: 16 }}
              value={activity.id}
              {...a11yProps(activity.id)}
            />
          </Tooltip>
        );
      })}
    </Tabs>
  );
}
