import { Button } from '@material-ui/core';
import React from 'react';

import * as S from './GameBar.styles';

export default function GameBar({
  onStart,
  isInHotseat,
  isPlaying,
  users,
  handleCorrect,
  hotSeatUserId,
}: {
  onStart: () => void;
  isPlaying: boolean;
  users: {
    byId: {
      [key: string]: {
        score: number;
        hasPlayed: boolean;
      };
    };
    allIds: string[];
  };
  isInHotseat: boolean;
  handleCorrect: () => void;
  hotSeatUserId: string;
}) {
  return (
    <S.GameBar>
      <div />
      <div>
        {!isPlaying ? (
          <Button onClick={onStart} color="primary" variant="contained">
            Start
          </Button>
        ) : (
          isInHotseat && (
            <div>
              <Button
                onClick={handleCorrect}
                color="primary"
                variant="contained"
              >
                Correct
              </Button>
              {/* <Button onClick={handlePass} color="primary" variant="contained"> */}
              {/*   Pass */}
              {/* </Button> */}
              <div>Score: {users.byId[hotSeatUserId].score}</div>
            </div>
          )
        )}
      </div>
      <div />
    </S.GameBar>
  );
}
