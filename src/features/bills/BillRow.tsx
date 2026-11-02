import { router } from 'expo-router';
import { memo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '@/components/theme';
import { type Bill, displayAmount, isSettled } from '@/domain/bill';

import { formatMoney, formatMonth } from './format';
import { StatusBadge } from './StatusBadge';

// memo: a refetch hands FlatList new arrays, but a row whose bill is unchanged need not re-render.
// The React Compiler would memoize this too; the explicit memo keeps it true without the compiler.
export const BillRow = memo(function BillRow({ bill }: { bill: Bill }) {
  return (
    // router.push rather than <Link asChild>: Link drops Pressable's style function on web.
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${formatMonth(bill.month)}, ${formatMoney(displayAmount(bill))}`}
      onPress={() => router.push({ pathname: '/bills/[id]', params: { id: bill.id } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Text style={styles.month}>{formatMonth(bill.month)}</Text>
        <StatusBadge status={bill.status} />
      </View>
      <Text style={[styles.amount, isSettled(bill) && styles.settled]}>{formatMoney(displayAmount(bill))}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
  },
  pressed: { opacity: 0.7 },
  left: { gap: 6 },
  month: { fontSize: 16, fontWeight: '600', color: colors.text },
  amount: { fontSize: 16, fontWeight: '600', color: colors.text, fontVariant: ['tabular-nums'] },
  settled: { color: colors.muted },
});
