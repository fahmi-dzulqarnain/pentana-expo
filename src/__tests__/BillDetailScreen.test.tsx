import { screen } from '@testing-library/react-native';
import { useLocalSearchParams } from 'expo-router';

import BillDetailScreen from '@/app/bills/[id]';
import { fakeRepositories, renderWithRepositories } from '@/test/fixtures';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  useLocalSearchParams: jest.fn(),
}));

it('shows the breakdown for a part-paid bill', async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '2' });
  await renderWithRepositories(<BillDetailScreen />);

  expect(await screen.findByText('Partly paid')).toBeOnTheScreen();
  expect(screen.getByText('RM 50.00')).toBeOnTheScreen(); // amount due
  expect(screen.getByText('RM 20.00')).toBeOnTheScreen(); // paid so far
  expect(screen.getAllByText('RM 30.00')).toHaveLength(2); // headline + outstanding row
});

it('reads the bill from the list without a second request', async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '1' });
  const repositories = fakeRepositories();
  await renderWithRepositories(<BillDetailScreen />, repositories);

  expect(await screen.findByText('Unpaid')).toBeOnTheScreen();
  expect(repositories.bills.list).toHaveBeenCalledTimes(1);
  expect(repositories.bills.summary).not.toHaveBeenCalled();
});

it('says so when the bill does not exist', async () => {
  jest.mocked(useLocalSearchParams).mockReturnValue({ id: '999' });
  await renderWithRepositories(<BillDetailScreen />);

  expect(await screen.findByText('Bill not found')).toBeOnTheScreen();
});
