import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, font, radius, spacing } from '../theme';

/** Front page. Placeholder content until the first components land. */
export default function Home() {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.screen,
        {
          paddingTop: insets.top + spacing.xl,
          paddingBottom: insets.bottom + spacing.md,
        },
      ]}
    >
      <View style={styles.hero}>
        <Text style={styles.title}>Shadery</Text>
        <Text style={styles.tagline}>
          GPU shader components for React Native.
        </Text>
        <Text style={styles.placeholder}>
          Placeholder: a live hero shader and a short intro go here once the
          first components are built.
        </Text>
      </View>

      <Pressable
        onPress={() => router.push('/components')}
        accessibilityRole="button"
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      >
        <Text style={styles.buttonText}>Browse components</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    justifyContent: 'space-between',
  },
  hero: { gap: spacing.md },
  title: { fontSize: 40, fontWeight: '700', color: colors.text },
  tagline: { fontSize: 20, color: colors.text },
  placeholder: { ...font.body, color: colors.textSecondary, lineHeight: 22 },
  button: {
    backgroundColor: colors.accent,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    alignItems: 'center',
  },
  pressed: { opacity: 0.8 },
  buttonText: { ...font.title, color: colors.background },
});
