import { TextField, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import { useTheme } from '@material-ui/core/styles';
import ScreenShareIcon from '@material-ui/icons/ScreenShare';
import SportsEsportsIcon from '@material-ui/icons/SportsEsports';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import React from 'react';

import Button from '../Button/Button';
import Header from '../Header';
import * as S from './Home.styles';
import useBackgroundArt from './lib/useBackgroundArt';

interface Props {
  onAddGroup: (event: React.SyntheticEvent) => void;
  onRoomNameChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  roomName: string;
}

export default function Home(props: Props) {
  const theme = useTheme();

  const { backgroundArt } = useBackgroundArt();

  return (
    <S.Home>
      <S.Hero path={backgroundArt?.path || ''}>
        <Header />
        <Box
          width={[1, 1, 1, '1240px']}
          margin="0 auto"
          display="flex"
          alignItems="center"
          height="100%"
          flexDirection={['column', 'column', 'row', 'row']}
        >
          <Box
            width={[1, 1, 1 / 2, 5 / 8]}
            mt={['80px', '80px', 0, 0]}
            pr={[0, 0, '80px', '80px']}
          >
            <S.Title>Free and secure video hangouts for everyone.</S.Title>
          </Box>
          <Box width={[1, 1, 1 / 2, 3 / 8]} p={['20px', '20px', '20px', 0]}>
            <S.FormWrapper
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <S.Form onSubmit={props.onAddGroup}>
                <Box mb={theme.spacing(0.5)}>
                  <Typography variant="h4">Get Started</Typography>
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
                    placeholder="eg. Game Night"
                  />
                </Box>
                <Button
                  color="primary"
                  aria-label="add"
                  onClick={props.onAddGroup}
                  variant="contained"
                  disabled={!props.roomName}
                  size="large"
                >
                  Create Room
                </Button>
              </S.Form>
            </S.FormWrapper>
          </Box>
          <S.Citation target="_blank" href={backgroundArt?.artistUrl}>
            {backgroundArt?.artistName}
          </S.Citation>
        </Box>
      </S.Hero>

      <S.Features width="100%" overflow="auto">
        <Box width="1240px" margin="0 auto" display="flex">
          <S.Feature width={1 / 3}>
            <S.FeatureIcon>
              <VerifiedUserIcon fontSize="large" />
            </S.FeatureIcon>
            <S.FeatureTitle>End-to-End Encryption</S.FeatureTitle>
            <S.FeatureDescription>
              All audio and video is sent via an encypted connection using
              WebRTC
            </S.FeatureDescription>
          </S.Feature>

          <S.Feature width={1 / 3}>
            <S.FeatureIcon>
              <ScreenShareIcon fontSize="large" />
            </S.FeatureIcon>
            <S.FeatureTitle>Screen-Share</S.FeatureTitle>
            <S.FeatureDescription>
              Share your whole desktop, application window, or just a browser
              tab.{' '}
              <div>
                <small>*Audio share via browser tab only</small>
              </div>
            </S.FeatureDescription>
          </S.Feature>

          <S.Feature width={1 / 3}>
            <S.FeatureIcon>
              <SportsEsportsIcon fontSize="large" />
            </S.FeatureIcon>
            <S.FeatureTitle>Games and Tools</S.FeatureTitle>
            <S.FeatureDescription>
              Play games, collaborate, and watch live streams together via a
              growing library of built-in 3rd party apps.
            </S.FeatureDescription>
          </S.Feature>
        </Box>
      </S.Features>
      <S.Footer>
        <div>
          Built in NYC by{' '}
          <S.FooterLink
            target="_blank"
            href="https://github.com/getcorgi/corgi/graphs/contributors"
          >
            these fine folk.
          </S.FooterLink>
        </div>
        <div>
          <S.FooterMessage>corgi loves you.</S.FooterMessage>
        </div>
      </S.Footer>
    </S.Home>
  );
}
