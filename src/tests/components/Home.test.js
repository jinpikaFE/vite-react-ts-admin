import React from 'react';
import { render, cleanup } from '@testing-library/react';
import Home from '../../pages/home';
import {jest} from '@jest/globals';

jest.useFakeTimers();

afterEach(cleanup);

it('should take a snapshot', () => {
  const { asFragment } = render(<Home />);

  expect(asFragment()).toMatchSnapshot();
});
