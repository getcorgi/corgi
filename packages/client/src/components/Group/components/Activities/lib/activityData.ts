import { ActivityId } from './useActivities';

const generateId = (length: number) =>
  Array(length)
    .fill(0)
    .map(x =>
      Math.random()
        .toString(36)
        .charAt(2),
    )
    .join('');

const getExalidrawUrl = () => {
  const roomId = generateId(20);
  const secret = generateId(22);

  return `https://excalidraw.com/#room=${roomId},${secret}`;
};

export const ACTIVITY_IDS_BY_GROUP = {
  Video: [ActivityId.Twitch],
  Games: [ActivityId.Dominion],
  Tools: [ActivityId.Excalidraw, ActivityId.SharedIframe],
};

export const ACTIVITIES_BY_ID = {
  [ActivityId.Twitch]: {
    label: 'Twitch',
    id: ActivityId.Twitch,
    url: 'https://player.twitch.tv/?channel=',
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
    url: 'https://dominion.games',
  },
  [ActivityId.Excalidraw]: {
    label: 'Excalidraw',
    id: ActivityId.Excalidraw,
    url: getExalidrawUrl(),
  },
  [ActivityId.SharedIframe]: {
    label: 'Web Browser',
    id: ActivityId.SharedIframe,
    url: 'http://',
  },
};
