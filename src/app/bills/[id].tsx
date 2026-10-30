import { Stack, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { EmptyState, ErrorState, Loading } from '@/components/ScreenState';
import { colors } from '@/components/theme';
import { formatMoney, formatMonth } from '@/features/bills/format';
import { useBill } from '@/features/bills/hooks';
import { StatusBadge } from '@/features/bills/StatusBadge';

export default function BillDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: bill, isLoading, isError, error, refetch } = useBill(Number(id));

  if (isLoading) return <Loading />;
  if (isError) return <ErrorState message={error.message} onRetry={refetch} />;
  if (!bill) return <EmptyState title="Bill not found" body="It may have been removed. Pull to refresh the list." />;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: formatMonth(bill.month) }} />
      <View style={styles.card}>
        <StatusBadge status={bill.status} />
        <Text style={styles.label}>Outstanding</Text>
        <Text style={styles.big}>{formatMoney(bill.outstanding)}</Text>
      </View>
      <View style={styles.card}>
        <Row label="Amount due" value={formatMoney(bill.amount_due)} />
        <View style={styles.divider} />
        <Row label="Paid so far" value={formatMoney(bill.amount_paid)} />
        <View style={styles.divider} />
        <Row label="Outstanding" value={formatMoney(bill.outstanding)} strong />
      </View>
    </ScrollView>
  );
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, strong && styles.strong]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 12 },
  card: { backgroundColor: colors.card, borderRadius: 12, padding: 16, gap: 6 },
  label: { marginTop: 8, color: colors.muted },
  big: { fontSize: 30, fontWeight: '700', color: colors.text, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 6 },
  rowLabel: { color: colors.muted, fontSize: 15 },
  rowValue: { color: colors.text, fontSize: 15, fontVariant: ['tabular-nums'] },
  strong: { fontWeight: '700' },
  divider: { height: StyleSheet.hairlineWidth, backgroundColor: colors.border },
});
