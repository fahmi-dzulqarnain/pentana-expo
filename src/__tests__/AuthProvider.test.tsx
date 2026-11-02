import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { act, renderHook, waitFor } from '@testing-library/react-native';
import type { ReactNode } from 'react';

import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { tokenStore } from '@/auth/tokenStore';

jest.mock('@/auth/tokenStore', () => ({
  tokenStore: { read: jest.fn(), write: jest.fn(), clear: jest.fn() },
}));

const fetchMock = jest.fn();
globalThis.fetch = fetchMock;

function respond(status: number, body: unknown) {
  return Promise.resolve({ ok: status < 400, status, json: async () => body } as Response);
}

function wrapper({ children }: { children: ReactNode }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: Infinity } } });
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  );
}

beforeEach(() => {
  jest.mocked(tokenStore.read).mockResolvedValue(null);
  jest.mocked(tokenStore.write).mockResolvedValue();
  jest.mocked(tokenStore.clear).mockResolvedValue();
  fetchMock.mockReset();
});

it('starts signed in when a token was saved', async () => {
  jest.mocked(tokenStore.read).mockResolvedValue('saved-token');
  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('signedIn'));
});

it('starts signed out when secure storage cannot be read', async () => {
  jest.mocked(tokenStore.read).mockRejectedValue(new Error('keychain locked'));
  const { result } = await renderHook(() => useAuth(), { wrapper });

  await waitFor(() => expect(result.current.status).toBe('signedOut'));
});

it('stores the token on sign-in and sends it on later requests', async () => {
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.status).toBe('signedOut'));

  fetchMock.mockReturnValueOnce(respond(200, { token: 'new-token', user: {} }));
  await act(() => result.current.signIn('member@pentana.test', 'secret'));

  expect(tokenStore.write).toHaveBeenCalledWith('new-token');
  expect(result.current.status).toBe('signedIn');

  fetchMock.mockReturnValueOnce(respond(200, { data: [] }));
  await act(() => result.current.api.get('/bills'));
  expect(fetchMock.mock.lastCall?.[1].headers.Authorization).toBe('Bearer new-token');
});

it('signs out and clears the token when the server rejects it', async () => {
  jest.mocked(tokenStore.read).mockResolvedValue('expired-token');
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.status).toBe('signedIn'));

  fetchMock.mockReturnValueOnce(respond(401, { message: 'Unauthenticated.' }));
  await act(() => result.current.api.get('/bills').catch(() => undefined));

  await waitFor(() => expect(result.current.status).toBe('signedOut'));
  expect(tokenStore.clear).toHaveBeenCalled();
});

it('signs out locally even if revoking the token fails', async () => {
  jest.mocked(tokenStore.read).mockResolvedValue('saved-token');
  const { result } = await renderHook(() => useAuth(), { wrapper });
  await waitFor(() => expect(result.current.status).toBe('signedIn'));

  fetchMock.mockRejectedValueOnce(new TypeError('Network request failed'));
  await act(() => result.current.signOut());

  expect(result.current.status).toBe('signedOut');
  expect(tokenStore.clear).toHaveBeenCalled();
});
