import { atom } from 'recoil';

export const pinnedStreamIdState = atom<null | string>({
  key: 'Group__pinnedStreamId',
  default: null,
});

export const groupAdminIdState = atom({
  key: 'Group__adminId',
  default: '',
});

export const groupIdState = atom({
  key: 'Group__id',
  default: '',
});
