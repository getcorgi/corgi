import { atom } from 'recoil';

export enum ActivityId {
  SharedIframe = 'SharedIframe',
}

export const activeActivityIdsState = atom<ActivityId[]>({
  key: 'Activities__activeActivityIdsState',
  default: [],
});
