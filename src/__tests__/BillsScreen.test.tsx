import { fireEvent, screen } from '@testing-library/react-native';
import { router } from 'expo-router';

import BillsScreen from '@/app/index';
import { fakeRepositories, renderWithRepositories } from '@/test/fixtures';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  router: { push: jest.fn() },
}));

jest.mock('@/auth/AuthProvider', () => ({
  useAuth: () => ({ signOut: jest.fn() }),
}));

beforeEach(() => jest.mocked(router.push).mockClear());

it('shows the outstanding total and each bill', async () => {
  await renderWithRepositories(<BillsScreen />);

  expect(await screen.findByText('RM 80.00')).toBeOnTheScreen();
  expect(screen.getByText('2 unpaid of 3 · credit RM 10.00')).toBeOnTheScreen();
  expect(screen.getByText('Unpaid')).toBeOnTheScreen();
  expect(screen.getByText('Partly paid')).toBeOnTheScreen();
  expect(screen.getByText('Paid')).toBeOnTheScreen();
  // A part-paid bill shows what is still owed, not the original amount.
  expect(screen.getByText('RM 30.00')).toBeOnTheScreen();
});

it('opens a bill’s detail when its row is pressed', async () => {
  await renderWithRepositories(<BillsScreen />);

  await fireEvent.press(await screen.findByText('Partly paid'));
  expect(router.push).toHaveBeenCalledWith({ pathname: '/bills/[id]', params: { id: 2 } });
});

it('shows an empty state when there are no bills', async () => {
  await renderWithRepositories(<BillsScreen />, fakeRepositories({ list: jest.fn(async () => []) }));

  expect(await screen.findByText('No bills yet')).toBeOnTheScreen();
});

it('shows an error and recovers on retry', async () => {
  const list = jest.fn().mockRejectedValueOnce(new Error('Network request failed'));
  const repositories = fakeRepositories({ list });
  list.mockImplementation(fakeRepositories().bills.list);

  await renderWithRepositories(<BillsScreen />, repositories);
  expect(await screen.findByText('Network request failed')).toBeOnTheScreen();

  await fireEvent.press(screen.getByText('Try again'));
  expect(await screen.findByText('Partly paid')).toBeOnTheScreen();
});
