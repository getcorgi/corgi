import React from 'react';

import ActivityIframe from '../activities/ActivityIframe';
import Excalidraw from '../activities/Excalidraw';
import SharedIframe from '../activities/SharedIframe';
import { ActivityId } from './useActivities';

export default function mapActivityIdToComponent(id?: ActivityId) {
  switch (id) {
    case ActivityId.SharedIframe:
      return <SharedIframe />;
    case ActivityId.Dominion:
      return <ActivityIframe id={id} url="http://dominion.games" />;
    case ActivityId.Twitch:
      return (
        <ActivityIframe id={id} url="https://player.twitch.tv/?channel=" />
      );
    case ActivityId.Excalidraw:
      return <Excalidraw />;
    default:
      return null;
  }
}
