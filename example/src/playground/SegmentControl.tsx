import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { colors, font, radius, spacing } from '../theme';

interface SegmentControlProps<T extends string> {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
}

/** Pick one of a few options (e.g. a color scheme). Scrolls horizontally when long. */
export function SegmentControl<T extends string>({
  label,
  options,
  value,
  onChange,
}: SegmentControlProps<T>) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.options}
      >
        {options.map((option) => {
          const selected = option === value;
          return (
            <Pressable
              key={option}
              onPress={() => onChange(option)}
              accessibilityRole="button"
              accessibilityState={{ selected }}
              style={[styles.option, selected && styles.optionSelected]}
            >
              <Text
                style={[
                  styles.optionText,
                  selected && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.sm, gap: spacing.sm },
  label: { ...font.body, color: colors.text },
  options: { gap: spacing.sm },
  option: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.sm,
    backgroundColor: colors.track,
  },
  optionSelected: { backgroundColor: colors.accent },
  optionText: { ...font.caption, color: colors.text },
  optionTextSelected: { color: colors.background, fontWeight: '600' },
});
