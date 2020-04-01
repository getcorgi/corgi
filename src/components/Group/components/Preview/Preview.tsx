import { Button, Card, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

import classes from '*.module.css';

import Video from '../Video';

interface Props {
  groupName: string;
  onJoin: () => void;
  stream: MediaStream;
  toggleIsMuted: () => void;
  toggleCamera: () => void;
}

export default function Preview(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  return (
    <Box data-testid="group">
      <Box m={theme.spacing(0.5)} display="flex" pb={addButtonSpacing}>
        <Box m={theme.spacing(0.5)}>
          <Card>
            <Video
              key={props.stream.id}
              srcObject={props.stream}
              autoPlay={true}
              isMuted={true}
              isMirrored={true}
              width="740px"
              height="400px"
            />
          </Card>
        </Box>
        <Box
          m={theme.spacing(0.5)}
          display="flex"
          justifyContent="center"
          flexDirection="column"
        >
          <Box mb={theme.spacing(0.5)}>
            <Typography>{props.groupName}</Typography>
          </Box>
          <Button
            onClick={props.onJoin}
            variant="contained"
            color="primary"
            id="callButton"
          >
            Call
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
