import { Button, TextField, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import React from 'react';

import Header from '../Header';
import * as S from './Home.styles';

interface Props {
  onAddGroup: (event: React.SyntheticEvent) => void;
  onRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  roomName: string;
}

export default function Home(props: Props) {
  const theme = useTheme();
  return (
    <>
      <Header />

      <S.FormWrapper
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100%"
      >
        <S.Form onSubmit={props.onAddGroup}>
          <Typography variant="h4">Get Started</Typography>
          <Box mb={theme.spacing(0.5)}>
            <Typography variant="h6">Create a new room</Typography>
          </Box>
          <Box mb={theme.spacing(0.5)} width="100%">
            <TextField
              fullWidth={true}
              autoFocus={true}
              required={true}
              label="Room Name"
              onChange={props.onRoomNameChange}
              value={props.roomName}
              variant="outlined"
            />
          </Box>
          <Button
            color="primary"
            aria-label="add"
            onClick={props.onAddGroup}
            variant="contained"
            disabled={!props.roomName}
          >
            Create
          </Button>
        </S.Form>
      </S.FormWrapper>
    </>
  );
}
