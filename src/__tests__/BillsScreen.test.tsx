import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import type { Bill, BillSummary } from '@/api/types';

import BillsScreen from '@/app/index';

jest.mock('expo-router', () => ({
  Stack: { Screen: () => null },
  Link: ({ children }: { children: ReactNode }) => children,
}));

const mockGet = jest.fn();
jest.mock('@/auth/AuthProvider', () => ({
  useAuth: () => ({ api: { get: mockGet, post: jest.fn() }, signOut: jest.fn() }),
}));

const bills: Bill[] = [
  { id: 1, month: '2026-10', amount_due: '50.00', amount_paid: '0.00', outstanding: '50.00', status: 'unpaid' },
  { id: 2, month: '2026-09', amount_due: '50.00', amount_paid: '50.00', outstanding: '0.00', status: 'paid' },
];
const summary: BillSummary = { total_outstanding: '50.00', available_credit: '10.00', unpaid_count: 1, bill_count: 2 };

function respond(routes: Record<string, unknown>) {
  mockGet.mockImplementation(async (path: string) => {
    if (!(path in routes)) throw new Error(`Unexpected GET ${path}`);
    const body = routes[path];
    if (body instanceof Error) throw body;
    return { data: body };
  });
}

async function renderScreen() {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  return render(
    <QueryClientProvider client={client}>
      <BillsScreen />
    </QueryClientProvider>,
  );
}

beforeEach(() => mockGet.mockReset());

it('shows the outstanding total and each bill', async () => {
  respond({ '/bills': bills, '/bills/summary': summary });
  await renderScreen();

  expect(await screen.findByText('1 unpaid of 2 · credit RM 10.00')).toBeOnTheScreen();
  expect(screen.getByText('Unpaid')).toBeOnTheScreen();
  expect(screen.getByText('Paid')).toBeOnTheScreen();
  expect(screen.getAllByText('RM 50.00')).toHaveLength(3); // summary + both rows
});

it('shows an empty state when there are no bills', async () => {
  respond({ '/bills': [], '/bills/summary': { ...summary, unpaid_count: 0, bill_count: 0 } });
  await renderScreen();

  expect(await screen.findByText('No bills yet')).toBeOnTheScreen();
});

it('shows an error and retries', async () => {
  respond({ '/bills': new Error('Network request failed'), '/bills/summary': summary });
  await renderScreen();

  expect(await screen.findByText('Network request failed')).toBeOnTheScreen();

  respond({ '/bills': bills, '/bills/summary': summary });
  await fireEvent.press(screen.getByText('Try again'));
  expect(await screen.findByText('Unpaid')).toBeOnTheScreen();
});
