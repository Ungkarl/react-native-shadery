import { Link } from 'expo-router';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { DEMOS } from '../registry';
import type { DemoEntry } from '../registry';
import { colors, font, radius, spacing } from '../theme';

const TABLET_WIDTH = 768;

function DemoCard({ demo }: { demo: DemoEntry }) {
  const { Thumbnail } = demo;
  return (
    <Link href={`/${demo.slug}`} asChild>
      <Pressable
        style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
      >
        <View style={styles.thumbnail}>
          <Thumbnail />
        </View>
        <View style={styles.cardText}>
          <Text style={styles.name}>{demo.name}</Text>
          <Text style={styles.description}>{demo.description}</Text>
        </View>
      </Pressable>
    </Link>
  );
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.emptyTitle}>No components yet.</Text>
      <Text style={styles.description}>
        Add one in <Text style={styles.code}>example/src/registry.ts</Text>.
      </Text>
      <Link href="/dev/hello-shader" style={styles.link}>
        Open the hello-shader smoke test →
      </Link>
    </View>
  );
}

export default function Gallery() {
  const { width } = useWindowDimensions();
  const columns = width >= TABLET_WIDTH ? 2 : 1;

  return (
    <FlatList
      // Changing numColumns on the fly requires a fresh list.
      key={columns}
      numColumns={columns}
      data={DEMOS}
      keyExtractor={(demo) => demo.slug}
      renderItem={({ item }) => <DemoCard demo={item} />}
      ListEmptyComponent={EmptyState}
      contentContainerStyle={styles.list}
      columnWrapperStyle={columns > 1 ? styles.columns : undefined}
      contentInsetAdjustmentBehavior="automatic"
    />
  );
}

const styles = StyleSheet.create({
  list: { padding: spacing.md, gap: spacing.md },
  columns: { gap: spacing.md },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: colors.card,
  },
  cardPressed: { backgroundColor: colors.cardPressed },
  thumbnail: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardText: { flex: 1, gap: spacing.xs },
  name: { ...font.title, color: colors.text },
  description: { ...font.caption, color: colors.textSecondary },
  empty: {
    padding: spacing.lg,
    borderRadius: radius.md,
    backgroundColor: colors.card,
    gap: spacing.sm,
  },
  emptyTitle: { ...font.title, color: colors.text },
  code: { fontFamily: 'Menlo', color: colors.text },
  link: { ...font.body, color: colors.accent, marginTop: spacing.sm },
});
