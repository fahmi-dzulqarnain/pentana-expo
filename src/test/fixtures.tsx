// Shared test fixtures: domain data, a fake repository, and a render helper with the app's providers.
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render } from '@testing-library/react-native';
import type { ReactElement } from 'react';

import { type Repositories, RepositoriesProvider } from '@/di/RepositoriesProvider';
import type { Bill, BillSummary } from '@/domain/bill';

export const bills: Bill[] = [
  { id: 1, month: { year: 2026, month: 10 }, amountDue: 5000, amountPaid: 0, outstanding: 5000, status: 'unpaid' },
  { id: 2, month: { year: 2026, month: 9 }, amountDue: 5000, amountPaid: 2000, outstanding: 3000, status: 'partial' },
  { id: 3, month: { year: 2026, month: 8 }, amountDue: 5000, amountPaid: 5000, outstanding: 0, status: 'paid' },
];

export const summary: BillSummary = { totalOutstanding: 8000, availableCredit: 1000, unpaidCount: 2, billCount: 3 };

export function fakeRepositories(overrides: Partial<Repositories['bills']> = {}): Repositories {
  return {
    bills: {
      list: jest.fn(async () => bills),
      summary: jest.fn(async () => summary),
      ...overrides,
    },
  };
}

export function renderWithRepositories(ui: ReactElement, repositories: Repositories = fakeRepositories()) {
  // gcTime: Infinity stops TanStack Query leaving garbage-collection timers behind after each test.
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  return render(
    <QueryClientProvider client={client}>
      <RepositoriesProvider value={repositories}>{ui}</RepositoriesProvider>
    </QueryClientProvider>,
  );
}
