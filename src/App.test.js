import React from 'react';
import ReactDOM from 'react-dom';
import {
  render,
  fireEvent,
  cleanup,
  waitForElement,
  act
} from 'react-testing-library';
import fetchMock from 'jest-fetch-mock';
import { PLAYERS_ENDPOINT, CALCULATE_ELO_ENDPOINT } from './util/constants';
import App from './App';

const mockedPlayers = JSON.stringify([
  {
    name: 'Stian',
    rating: 900
  },
  {
    name: 'Øyvind',
    rating: 1100
  },
  {
    name: 'Emil',
    rating: 950
  }
]);

const mockedRating = JSON.stringify({
  newRating: 1337
});

afterEach(() => {
  fetch.resetMocks();
  cleanup();
});

test('fetches players and their ratings from database and populates the select', async () => {
  fetch.mockResponseOnce(mockedPlayers);

  const { getByText, container } = render(<App />);

  const option = await waitForElement(() => getByText(/Emil/i));

  expect(option.innerHTML).toBe('Emil');
  expect(option.value).toBe('950');
  expect(fetch.mock.calls.length).toBe(1);
});

test('submits ratings and match result and displays the updated ELO', async () => {
  fetch.mockResponseOnce(mockedPlayers);

  const { getByText, container } = render(<App />);
  const form = container.getElementsByTagName('form')[0];

  fetch.mockResponseOnce(mockedRating);

  fireEvent.submit(form);

  const score = await waitForElement(() => getByText(/Din nye rating/i));

  expect(score.innerHTML).toEqual('Din nye rating: ' + 1337);
  expect(fetch.mock.calls.length).toBe(2);
});
