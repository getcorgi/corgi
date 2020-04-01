import { render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';

import useGroups, { UseGroupsResult } from '../../lib/hooks/useGroups';
import Boards from './GroupsContainer';

jest.mock('../../lib/hooks/useGroups', () => jest.fn());
jest.mock('../../lib/hooks/useUpdateGroups', () => jest.fn());

describe('Boards', () => {
  it('renders loading when useGroups is loading', () => {
    (useGroups as jest.Mock).mockImplementation(
      (): UseGroupsResult => ({
        data: [],
        error: {},
        loading: true,
      }),
    );

    const { getByText } = render(
      <MemoryRouter>
        <Boards />
      </MemoryRouter>,
    );
    expect(getByText(/Loading.../)).toBeTruthy();
  });

  it('renders error when useGroups returns error', () => {
    (useGroups as jest.Mock).mockImplementation(
      (): UseGroupsResult => ({
        data: [],
        error: {},
        loading: false,
      }),
    );

    const { getByText } = render(
      <MemoryRouter>
        <Boards />
      </MemoryRouter>,
    );
    expect(getByText(/Error Loading Boards/)).toBeTruthy();
  });

  it('renders component when useGroups returns data', () => {
    (useGroups as jest.Mock).mockImplementation(
      (): UseGroupsResult => ({
        data: [
          {
            id: 'mockId',
            type: 'mockType',
            name: 'mockName',
          },
        ],
        error: false,
        loading: false,
      }),
    );

    const { getByText } = render(
      <MemoryRouter>
        <Boards />
      </MemoryRouter>,
    );
    expect(getByText(/mockName/)).toBeTruthy();
  });
});
