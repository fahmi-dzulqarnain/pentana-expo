import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/components/theme';
import type { BillStatus } from '@/domain/bill';

import { statusLabel } from './format';

export function StatusBadge({ status }: { status: BillStatus }) {
  const tone = colors.status[status];
  return (
    <View style={[styles.badge, { backgroundColor: tone.bg }]}>
      <Text style={[styles.text, { color: tone.fg }]}>{statusLabel[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 999 },
  text: { fontSize: 12, fontWeight: '600' },
});
