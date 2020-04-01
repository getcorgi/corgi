import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import Tile from '../Tile';
import * as S from './Groups.styles';

interface Props {
  groups: {
    id: string;
    name: string;
  }[];
  onAddGroup: () => void;
}

export default function(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  return (
    <>
      <Box m={theme.spacing(0.5)}>
        <Typography variant="h4" component="h1">
          Rooms
        </Typography>
      </Box>
      <Divider />
      <Box m={theme.spacing(0.5)} pb={addButtonSpacing}>
        <Grid container spacing={4}>
          {props.groups.map(group => (
            <Tile
              key={group.id}
              id={group.id}
              name={group.name}
              link={`groups/${group.id}`}
            />
          ))}
        </Grid>
        <Box display="flex" justifyContent="flex-end">
          <S.AddButton
            color="primary"
            aria-label="add"
            spacing={theme.spacing(2)}
            onClick={props.onAddGroup}
            variant="extended"
          >
            <S.AddButtonIcon spacing={addButtonSpacing} />
            Create New Room
          </S.AddButton>
        </Box>
      </Box>
    </>
  );
}
