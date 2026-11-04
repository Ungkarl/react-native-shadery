import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

interface ResetButtonProps {
  onPress: () => void;
}

/** Restores a demo's default props. */
export function ResetButton({ onPress }: ResetButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <Text style={styles.text}>Reset to defaults</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: spacing.sm,
    paddingVertical: spacing.sm + 2,
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.textSecondary,
    alignItems: 'center',
  },
  pressed: { backgroundColor: colors.cardPressed },
  text: { ...font.body, color: colors.text },
});
