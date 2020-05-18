import { fireEvent, render } from '@testing-library/react';
import React from 'react';

import ActivityTabs from './ActivityTabs';

describe('<ActivityTabs />', () => {
  test('clicking on a tab fires setActiveViewId with the right id', () => {
    const setActiveViewId = jest.fn();
    const { getByText } = render(
      <ActivityTabs
        activeActivityIndex={0}
        activeViewId="foo"
        activities={[
          {
            id: 'activityOne',
            name: 'acivitity one',
            icon: 'video_call',
          },
          {
            id: 'activityTwo',
            name: 'acivitity two',
            icon: 'web',
          },
        ]}
        setActiveViewId={setActiveViewId}
      />,
    );
    // relies on icon backfill text, which is icon name
    fireEvent.click(getByText('video_call'));
    expect(setActiveViewId).toHaveBeenCalledTimes(1);
    expect(setActiveViewId).toHaveBeenCalledWith('activityOne');
    setActiveViewId.mockClear();
    fireEvent.click(getByText('web'));
    expect(setActiveViewId).toHaveBeenCalledTimes(1);
    expect(setActiveViewId).toHaveBeenCalledWith('activityTwo');
  });
});
