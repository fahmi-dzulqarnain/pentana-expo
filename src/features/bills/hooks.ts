// Use-case hooks: what the bills screens need, expressed against the repository, not the API.
import { useQuery } from '@tanstack/react-query';

import { useRepositories } from '@/di/RepositoriesProvider';

export const billKeys = {
  all: ['bills'] as const,
  summary: ['bills', 'summary'] as const,
};

export function useBills() {
  const { bills } = useRepositories();
  return useQuery({ queryKey: billKeys.all, queryFn: () => bills.list() });
}

/** The API has no single-bill endpoint, so a bill's detail is selected from the cached list: no extra request. */
export function useBill(id: number) {
  const { bills } = useRepositories();
  return useQuery({
    queryKey: billKeys.all,
    queryFn: () => bills.list(),
    select: list => list.find(bill => bill.id === id),
  });
}

export function useBillSummary() {
  const { bills } = useRepositories();
  return useQuery({ queryKey: billKeys.summary, queryFn: () => bills.summary() });
}
