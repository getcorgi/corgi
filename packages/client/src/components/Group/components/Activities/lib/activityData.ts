import { ActivityId } from './useActivities';

export const ACTIVITY_IDS_BY_GROUP = {
  Video: [ActivityId.Twitch],
  Games: [ActivityId.Dominion],
  Tools: [ActivityId.Excalidraw, ActivityId.SharedIframe],
};

export const ACTIVITIES_BY_ID = {
  [ActivityId.Twitch]: {
    label: 'Twitch',
    id: ActivityId.Twitch,
  },
  // {
  //   label: 'Youtube',
  //   id: 'youtube',
  //   url: 'https://www.youtube.com/embed/',
  //   kind: PresetKind.Item,
  // },
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
