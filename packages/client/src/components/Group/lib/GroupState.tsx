import { atom } from 'recoil';

export const pinnedStreamIdState = atom<null | string>({
  key: 'Group__pinnedStreamId',
  default: null,
});

export const groupAdminId = atom({
  key: 'Group__adminId',
  default: '',
});
