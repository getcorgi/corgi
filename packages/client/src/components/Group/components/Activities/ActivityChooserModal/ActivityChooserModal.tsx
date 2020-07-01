import { Box, Dialog, DialogContent, DialogTitle } from '@material-ui/core';
import React from 'react';
import { atom, useRecoilState } from 'recoil';

import theme from '../../../../../lib/theme';
import { ACTIVITIES_BY_ID, ACTIVITY_IDS_BY_GROUP } from '../lib/activityData';
import useActivities, { ActivityId } from '../lib/useActivities';
import * as S from './ActivityChooserModal.styles';

export const isActivityChooserModalOpenState = atom({
  key: 'Activities__isActivityChooserModalOpen',
  default: false,
});

export default function ActivityChooserModal() {
  const [isOpen, setIsOpen] = useRecoilState(isActivityChooserModalOpenState);

  const { toggleActivity } = useActivities();

  const handleActivityClick = (id: ActivityId) => () => {
    toggleActivity(id)();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Box p={theme.spacing(0.4)} width="600px">
        <DialogTitle>Choose an activity</DialogTitle>
        <DialogContent>
          {Object.entries(ACTIVITY_IDS_BY_GROUP).map(([groupName, items]) => {
            return (
              <Box mb="24px">
                <S.GroupLabel variant="subtitle2">{groupName}</S.GroupLabel>
                <Box display="flex">
                  {items.map(id => {
                    const activity = ACTIVITIES_BY_ID[id];

                    return (
                      <Box width={1 / 3} key={id}>
                        <S.ActivityChoice onClick={handleActivityClick(id)}>
                          {activity.label}
                        </S.ActivityChoice>
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            );
          })}
        </DialogContent>
      </Box>
    </Dialog>
  );
}
