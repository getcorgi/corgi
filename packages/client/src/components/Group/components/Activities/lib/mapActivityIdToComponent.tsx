import React from 'react';

import ActivityIframe from '../activities/ActivityIframe';
import SharedIframe from '../activities/SharedIframe';
import { ActivityId } from './useActivities';

export default function mapActivityIdToComponent(id?: ActivityId) {
  switch (id) {
    case ActivityId.SharedIframe:
      return <SharedIframe />;
    case ActivityId.Dominion:
    case ActivityId.Twitch:
    case ActivityId.Excalidraw:
      return <ActivityIframe activityId={id} />;
    default:
      return null;
  }
}
