import { StyleSheet, Switch, Text, View } from 'react-native';
import { colors, font, spacing } from '../theme';

interface ToggleControlProps {
  label: string;
  value: boolean;
  onChange: (value: boolean) => void;
}

/** Labelled switch. */
export function ToggleControl({ label, value, onChange }: ToggleControlProps) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ false: colors.track, true: colors.accent }}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
  },
  label: { ...font.body, color: colors.text },
});
