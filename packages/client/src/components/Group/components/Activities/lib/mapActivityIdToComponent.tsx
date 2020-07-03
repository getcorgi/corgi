import React from 'react';

import ActivityIframe from '../activities/ActivityIframe';
import Excalidraw from '../activities/Excalidraw';
import SharedIframe from '../activities/SharedIframe';
import Twitch from '../activities/Twitch';
import Youtube from '../activities/Youtube';
import { ActivityId } from './useActivities';

export default function mapActivityIdToComponent(id?: ActivityId) {
  switch (id) {
    case ActivityId.SharedIframe:
      return <SharedIframe />;
    case ActivityId.Dominion:
      return <ActivityIframe id={id} url="http://dominion.games" />;
    case ActivityId.Twitch:
      return <Twitch />;
    case ActivityId.Excalidraw:
      return <Excalidraw />;
    case ActivityId.Youtube:
      return <Youtube />;
    default:
      return null;
  }
}
