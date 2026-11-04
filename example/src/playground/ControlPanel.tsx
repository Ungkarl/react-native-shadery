import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { colors, radius, spacing } from '../theme';

interface ControlPanelProps {
  children: ReactNode;
}

/** Scrollable card that holds a demo's controls. */
export function ControlPanel({ children }: ControlPanelProps) {
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.card}>{children}</View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: { flex: 1 },
  content: { padding: spacing.md, paddingBottom: spacing.xl },
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },
});
