// Shared loading / error / empty states, so every screen handles all three the same way.
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from './theme';

export function Loading() {
  return (
    <View style={styles.center}>
      <ActivityIndicator color={colors.primary} accessibilityLabel="Loading" />
    </View>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.body}>{message}</Text>
      <Pressable accessibilityRole="button" onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Try again</Text>
      </Pressable>
    </View>
  );
}

export function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32, gap: 8 },
  title: { fontSize: 17, fontWeight: '600', color: colors.text },
  body: { fontSize: 15, color: colors.muted, textAlign: 'center' },
  button: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: colors.primary },
  buttonText: { color: '#fff', fontWeight: '600' },
});
