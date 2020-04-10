import { Button, TextField } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import AddIcon from '@material-ui/icons/Add';
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
          <Box mb={theme.spacing(0.5)} width="100%">
            <TextField
              fullWidth={true}
              autoFocus={true}
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
          >
            <Box display="flex" mr={theme.spacing(0.1)}>
              <AddIcon />
            </Box>
            Create New Room
          </Button>
        </S.Form>
      </S.FormWrapper>
    </>
  );
}
