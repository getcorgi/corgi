import { cleanup, fireEvent, render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { MemoryRouter, Router } from 'react-router-dom';

import ErrorPage from './ErrorPage';

describe('<ErrorPage />', () => {
  afterEach(cleanup);

  test('user sees an error message', () => {
    const { container } = render(
      <MemoryRouter>
        <ErrorPage />
      </MemoryRouter>,
    );
    expect(container.textContent).toMatch(
      'Oops... The link you are trying to reach cannot be found',
    );
  });

  test('user sees home button and can click on it to go home', () => {
    const history = createMemoryHistory();
    const { getByText } = render(
      <Router history={history}>
        <ErrorPage />
      </Router>,
    );
    history.push('/foo');
    expect(history.location.pathname).toBe('/foo');
    fireEvent.click(getByText('Go Home'));
    expect(history.location.pathname).toBe('/');
  });
});
