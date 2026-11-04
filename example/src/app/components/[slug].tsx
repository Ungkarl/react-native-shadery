import { Link, Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { findDemo } from '../../registry';
import { colors, font, spacing } from '../../theme';

export default function Playground() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const demo = findDemo(slug);

  if (!demo) {
    return (
      <View style={styles.notFound}>
        <Stack.Screen options={{ title: 'Not found' }} />
        <Text style={styles.title}>No component called “{slug}”.</Text>
        <Link href="/components" style={styles.link}>
          ← Back to the list
        </Link>
      </View>
    );
  }

  const { Demo } = demo;
  return (
    <>
      <Stack.Screen options={{ title: demo.name }} />
      <Demo />
    </>
  );
}

const styles = StyleSheet.create({
  notFound: { flex: 1, padding: spacing.lg, gap: spacing.md },
  title: { ...font.title, color: colors.text },
  link: { ...font.body, color: colors.accent },
});
