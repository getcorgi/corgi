import {
  AppBar,
  Box,
  Tab,
  Tabs,
} from '@material-ui/core';
import VideoCallIcon from '@material-ui/icons/VideoCall';
import WebIcon from '@material-ui/icons/Web';
import React from 'react';

function a11yProps(index: number) {
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
  return (
    <Box
      width="250px"
      display="flex"
      flexDirection="column"
      alignItems="center"
    >
      <AppBar position="static" color="default">
        <Tabs
          value={Number(props.activeViewId)}
          onChange={(event, value) => {
            props.setActiveViewId(`${value}`);
          }}
          variant="scrollable"
          scrollButtons="on"
          indicatorColor="primary"
          textColor="primary"
          aria-label="scrollable force tabs example"
        >
          <Tab
            style={{ minWidth: 50, width: 50 }}
            aria-label="Basic Video"
            icon={<VideoCallIcon />}
            {...a11yProps(0)}
          />
          <Tab
            style={{ minWidth: 50, width: 50 }}
            aria-label="Browse Together"
            icon={<WebIcon />}
            {...a11yProps(1)}
          />
          <Tab
            style={{ minWidth: 50, width: 50 }}
            aria-label="Browse Together"
            icon={<WebIcon />}
            {...a11yProps(1)}
          />
          <Tab
            style={{ minWidth: 50, width: 50 }}
            aria-label="Browse Together"
            icon={<WebIcon />}
            {...a11yProps(1)}
          />
          <Tab
            style={{ minWidth: 50, width: 50 }}
            aria-label="Browse Together"
            icon={<WebIcon />}
            {...a11yProps(1)}
          />
        </Tabs>
      </AppBar>
    </Box>
  );
}
