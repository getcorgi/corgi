import React from 'react';

import useGroup, { UseGroupResult } from '../../lib/hooks/useGroup';
import renderWithRouter from '../../lib/test/renderWithRouter';
import { GroupType } from '../../lib/types';
import GroupContainer from './GroupContainer';

jest.mock('../../lib/hooks/useGroup');
jest.mock('../../lib/hooks/useCards');
jest.mock('../../lib/hooks/useAddCard');

describe('GroupContainer', () => {
  it('does not show group on loading', () => {
    (useGroup as jest.Mock).mockImplementation(
      (): UseGroupResult => ({
        data: undefined,
        error: undefined,
        loading: true,
      }),
    );

    const { queryByTestId } = renderWithRouter(
      <GroupContainer
        match={{
          params: {
            groupId: 'mockid',
          },
        }}
      />,
    );
    expect(queryByTestId(/group/)).toBeFalsy();
  });

  it('shows the group on success', () => {
    (useGroup as jest.Mock).mockImplementation(
      (): UseGroupResult => ({
        data: {
          id: 'mockid',
          name: 'mock group',
          type: GroupType.group,
        },
        error: undefined,
        loading: false,
      }),
    );

    const { getByTestId } = renderWithRouter(
      <GroupContainer
        match={{
          params: {
            groupId: 'mockid',
          },
        }}
      />,
    );
    expect(getByTestId(/group/)).toBeTruthy();
  });

  it('redirects on error', () => {
    (useGroup as jest.Mock).mockImplementation(
      (): UseGroupResult => ({
        data: undefined,
        error: {
          message: 'oopsies',
        },
        loading: false,
      }),
    );

    const { history } = renderWithRouter(
      <GroupContainer
        match={{
          params: {
            groupId: 'mockid',
          },
        }}
      />,
    );

    expect(history.location.pathname).toEqual('/error');
  });
});
