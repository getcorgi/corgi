import { ActivityId } from './useActivities';

export const ACTIVITY_IDS_BY_GROUP = {
  Video: [ActivityId.Twitch, ActivityId.Youtube],
  Games: [ActivityId.Dominion],
  Tools: [ActivityId.Excalidraw, ActivityId.SharedIframe],
};

export const ACTIVITIES_BY_ID = {
  [ActivityId.Twitch]: {
    label: 'Twitch',
    id: ActivityId.Twitch,
  },
  [ActivityId.Youtube]: {
    label: 'Youtube',
    id: ActivityId.Youtube,
  },
  [ActivityId.Dominion]: {
    label: 'Dominion',
    id: ActivityId.Dominion,
  },
  [ActivityId.Excalidraw]: {
    label: 'Excalidraw',
    id: ActivityId.Excalidraw,
  },
  [ActivityId.SharedIframe]: {
    label: 'Web Browser',
    id: ActivityId.SharedIframe,
  },
};
