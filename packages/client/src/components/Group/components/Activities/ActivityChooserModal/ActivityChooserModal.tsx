import { Box, Dialog, DialogContent } from '@material-ui/core';
import React from 'react';
import { atom, useRecoilState } from 'recoil';

import { FEEDBACK_FORM_URL } from '../../../../../constants';
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

  const { toggleActivity, activeActivityIds } = useActivities();

  const handleActivityClick = (id: ActivityId) => () => {
    toggleActivity(id)();
    setIsOpen(false);
  };

  const getIsActivityActive = (id: ActivityId) => {
    return activeActivityIds.includes(id);
  };

  return (
    <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
      <Box p={theme.spacing(0.4)} width="600px">
        <DialogContent>
          <S.DialogTitle variant="h6">Choose an Activity</S.DialogTitle>
          <S.DialogSubtitle variant="body1">
            Activities are shared between all connected users.
          </S.DialogSubtitle>
        </DialogContent>
        <Box mt={2}>
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
                          <S.ActivityChoice
                            isActive={getIsActivityActive(id)}
                            onClick={handleActivityClick(id)}
                          >
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
        <Box display="flex" justifyContent="center" mt={2}>
          <S.FooterText variant="body2">
            Have an idea for an activity?{' '}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={FEEDBACK_FORM_URL}
            >
              Let us know!
            </a>
          </S.FooterText>
        </Box>
      </Box>
    </Dialog>
  );
}
