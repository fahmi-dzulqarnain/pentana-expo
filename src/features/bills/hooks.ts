import { useQuery } from '@tanstack/react-query';

import type { Bill, BillSummary, Wrapped } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';

export const billKeys = {
  all: ['bills'] as const,
  summary: ['bills', 'summary'] as const,
};

export function useBills() {
  const { api } = useAuth();
  return useQuery({
    queryKey: billKeys.all,
    queryFn: async () => (await api.get<Wrapped<Bill[]>>('/bills')).data,
  });
}

/** The API has no single-bill endpoint, so a bill's detail is read from the cached list. */
export function useBill(id: number) {
  const query = useBills();
  return { ...query, data: query.data?.find(bill => bill.id === id) };
}

export function useBillSummary() {
  const { api } = useAuth();
  return useQuery({
    queryKey: billKeys.summary,
    queryFn: async () => (await api.get<Wrapped<BillSummary>>('/bills/summary')).data,
  });
}
