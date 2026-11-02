import { Stack } from 'expo-router';
import { FlatList, type ListRenderItem, Pressable, RefreshControl, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { EmptyState, ErrorState, Loading } from '@/components/ScreenState';
import { colors } from '@/components/theme';
import type { Bill, BillSummary } from '@/domain/bill';
import { BillRow } from '@/features/bills/BillRow';
import { formatMoney } from '@/features/bills/format';
import { useBills, useBillSummary } from '@/features/bills/hooks';

// Defined once at module level, so FlatList gets the same functions on every render.
const keyExtractor = (bill: Bill) => String(bill.id);
const renderItem: ListRenderItem<Bill> = ({ item }) => <BillRow bill={item} />;
const Separator = () => <View style={styles.separator} />;
const Empty = <EmptyState title="No bills yet" body="Your monthly bills will appear here." />;

export default function BillsScreen() {
  const { signOut } = useAuth();
  const bills = useBills();
  const summary = useBillSummary();

  const refreshing = (bills.isRefetching || summary.isRefetching) && !bills.isLoading;
  const refresh = () => {
    bills.refetch();
    summary.refetch();
  };

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <Pressable accessibilityRole="button" onPress={signOut} hitSlop={8}>
              <Text style={styles.signOut}>Sign out</Text>
            </Pressable>
          ),
        }}
      />
      {bills.isLoading ? (
        <Loading />
      ) : bills.isError ? (
        <ErrorState message={bills.error.message} onRetry={refresh} />
      ) : (
        <FlatList
          data={bills.data}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          ItemSeparatorComponent={Separator}
          ListHeaderComponent={summary.data && <SummaryCard summary={summary.data} />}
          ListEmptyComponent={Empty}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} tintColor={colors.primary} />}
        />
      )}
    </>
  );
}

function SummaryCard({ summary }: { summary: BillSummary }) {
  return (
    <View style={styles.summary}>
      <Text style={styles.summaryLabel}>Outstanding</Text>
      <Text style={styles.summaryAmount}>{formatMoney(summary.totalOutstanding)}</Text>
      <Text style={styles.summaryMeta}>
        {summary.unpaidCount} unpaid of {summary.billCount} · credit {formatMoney(summary.availableCredit)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  signOut: { color: colors.primary, fontSize: 16 },
  list: { padding: 16, flexGrow: 1 },
  separator: { height: 10 },
  summary: { backgroundColor: colors.primary, borderRadius: 16, padding: 20, marginBottom: 16 },
  summaryLabel: { color: '#D1E7E0', fontSize: 14 },
  summaryAmount: { color: '#fff', fontSize: 30, fontWeight: '700', marginVertical: 4, fontVariant: ['tabular-nums'] },
  summaryMeta: { color: '#D1E7E0', fontSize: 13 },
});
