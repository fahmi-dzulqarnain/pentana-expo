import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';

import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { Loading } from '@/components/ScreenState';
import { colors } from '@/components/theme';
import { RepositoriesProvider } from '@/di/RepositoriesProvider';

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient({ defaultOptions: { queries: { staleTime: 60_000, retry: 1 } } }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <RepositoriesProvider>
          <StatusBar style="auto" />
          <RootStack />
        </RepositoriesProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function RootStack() {
  const { status } = useAuth();
  if (status === 'loading') return <Loading />;

  const signedIn = status === 'signedIn';
  return (
    <Stack screenOptions={{ headerTintColor: colors.primary, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Protected guard={signedIn}>
        <Stack.Screen name="index" options={{ title: 'Bills' }} />
        <Stack.Screen name="bills/[id]" options={{ title: 'Bill' }} />
      </Stack.Protected>
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="login" options={{ headerShown: false }} />
      </Stack.Protected>
    </Stack>
  );
}
