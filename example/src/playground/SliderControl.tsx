import Slider from '@react-native-community/slider';
import { StyleSheet, Text, View } from 'react-native';
import { colors, font, spacing } from '../theme';

interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
}

function decimalsFor(step: number) {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot === -1 ? 0 : text.length - dot - 1;
}

/** Labelled slider that shows its current value. */
export function SliderControl({
  label,
  value,
  min,
  max,
  step = 0.01,
  onChange,
}: SliderControlProps) {
  return (
    <View style={styles.row}>
      <View style={styles.header}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value.toFixed(decimalsFor(step))}</Text>
      </View>
      <Slider
        value={value}
        minimumValue={min}
        maximumValue={max}
        step={step}
        onValueChange={onChange}
        minimumTrackTintColor={colors.accent}
        maximumTrackTintColor={colors.track}
        thumbTintColor={colors.text}
        accessibilityLabel={label}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  row: { paddingVertical: spacing.xs },
  header: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { ...font.body, color: colors.text },
  value: { ...font.value, color: colors.textSecondary },
});
