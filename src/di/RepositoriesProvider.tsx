// Composition root for data access. Screens and hooks ask for repositories, never for the HTTP client,
// so tests can hand in fakes without mocking modules.
import { createContext, type ReactNode, useContext, useMemo } from 'react';

import { useAuth } from '@/auth/AuthProvider';
import { createApiBillsRepository } from '@/data/apiBillsRepository';
import type { BillsRepository } from '@/domain/billsRepository';

export type Repositories = { bills: BillsRepository };

const RepositoriesContext = createContext<Repositories | null>(null);

export function RepositoriesProvider({ children, value }: { children: ReactNode; value?: Repositories }) {
  if (value) return <RepositoriesContext.Provider value={value}>{children}</RepositoriesContext.Provider>;
  return <ApiRepositories>{children}</ApiRepositories>;
}

function ApiRepositories({ children }: { children: ReactNode }) {
  const { api } = useAuth();
  const repositories = useMemo(() => ({ bills: createApiBillsRepository(api) }), [api]);
  return <RepositoriesContext.Provider value={repositories}>{children}</RepositoriesContext.Provider>;
}

export function useRepositories() {
  const ctx = useContext(RepositoriesContext);
  if (!ctx) throw new Error('useRepositories must be used inside <RepositoriesProvider>');
  return ctx;
}
