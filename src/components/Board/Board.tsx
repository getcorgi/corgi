import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import React from 'react';

import { CardsDocumentData } from '../../lib/hooks/useCards';
import Tile from '../Tile';
import * as S from './Board.styles';

interface Props {
  name: string;
  start: () => void;
  call: () => void;
  hangup: () => void;
}

export default function Board(props: Props) {
  const theme = useTheme();
  const addButtonSpacing = theme.spacing(1);

  return (
    <Box data-testid="board">
      {/* <Box m={theme.spacing(0.5)}>
        <Typography variant="h4" component="h1">
          {props.name}
        </Typography>
      </Box>
      <Divider /> */}
      <Box m={theme.spacing(0.5)} pb={addButtonSpacing}>
        <video id="video1" playsinline autoPlay muted></video>
        <video id="video2" playsinline autoPlay></video>
        <video id="video3" playsinline autoPlay></video>

        <div>
          <button onClick={props.start} id="startButton">Start</button>
          <button onClick={props.call} id="callButton">Call</button>
          <button onClick={props.hangup} id="hangupButton">Hang Up</button>
        </div>
      
        
        
        {/* <Grid container spacing={4}>
          {props.cards.map(card => (
            <Tile key={card.id} id={card.id} name={card.description} />
          ))}
        </Grid>
        <S.AddButton
          color="primary"
          aria-label="add"
          spacing={theme.spacing(2)}
          onClick={props.onAddCard}
          variant="extended"
        >
          <S.AddButtonIcon spacing={addButtonSpacing} />
          Add a Card
        </S.AddButton> */}
      </Box>
    </Box>
  );
}
