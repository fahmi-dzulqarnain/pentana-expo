import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { Bill } from '@/api/types';
import { colors } from '@/components/theme';

import { formatMoney, formatMonth } from './format';
import { StatusBadge } from './StatusBadge';

export function BillRow({ bill }: { bill: Bill }) {
  const settled = bill.status === 'paid';
  return (
    // router.push rather than <Link asChild>: Link drops Pressable's style function on web.
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push({ pathname: '/bills/[id]', params: { id: bill.id } })}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.left}>
        <Text style={styles.month}>{formatMonth(bill.month)}</Text>
        <StatusBadge status={bill.status} />
      </View>
      <Text style={[styles.amount, settled && styles.settled]}>
        {formatMoney(settled ? bill.amount_due : bill.outstanding)}
      </Text>
    </Pressable>
  );
}

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
