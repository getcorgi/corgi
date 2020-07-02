import { Card } from '@material-ui/core';
import styled from 'styled-components';

export const LocalVideo = styled(Card).withConfig({
  shouldForwardProp: prop => !['isPortraitMode'].includes(prop),
})`
  position: absolute;
  bottom: 16px;
  right: 16px;
  width: ${({ isPortraitMode }: { isPortraitMode: boolean }) =>
    isPortraitMode ? '80px' : '150px'};
  height: ${({ isPortraitMode }: { isPortraitMode: boolean }) =>
    isPortraitMode ? '100px' : '84px'};
`;

export const TiledVideo = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  flexFlow: 'wrap-reverse',
  flexDirection: 'row',
});
