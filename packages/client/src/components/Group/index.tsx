import React from 'react';
import { RouteComponentProps } from 'react-router-dom';

import { MediaSettingsProvider } from '../MediaSettingsProvider';
import GroupContainer from './GroupContainer';

export default function EnhancedGroupContainer(
  props: RouteComponentProps<{ groupId: string }>,
) {
  return (
    <MediaSettingsProvider>
      <GroupContainer {...props} />
    </MediaSettingsProvider>
  );
}
