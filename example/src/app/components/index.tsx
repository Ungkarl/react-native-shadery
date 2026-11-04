import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { Pressable, SectionList, StyleSheet, Text, View } from 'react-native';
import { CATEGORIES, DEMOS, DEV_TOOLS } from '../../registry';
import { colors, font, radius, spacing } from '../../theme';

interface Row {
  key: string;
  name: string;
  description: string;
  href: Href;
  Thumbnail?: React.ComponentType;
}

interface Section {
  title: string;
  data: Row[];
}

function buildSections(): Section[] {
  const sections: Section[] = CATEGORIES.map((category) => ({
    title: category,
    data: DEMOS.filter((demo) => demo.category === category).map((demo) => ({
      key: demo.slug,
      name: demo.name,
      description: demo.description,
      href: `/components/${demo.slug}` as Href,
      Thumbnail: demo.Thumbnail,
    })),
  })).filter((section) => section.data.length > 0);

  if (__DEV__) {
    sections.push({
      title: 'Dev tools',
      data: DEV_TOOLS.map((tool) => ({
        key: tool.href,
        name: tool.name,
        description: tool.description,
        href: tool.href,
      })),
    });
  }
  return sections;
}

// The registry is static, so the sections never change while the app runs.
const SECTIONS = buildSections();

function ComponentRow({ row }: { row: Row }) {
  const { Thumbnail } = row;
  return (
    <Pressable
      // Pushed on top of the modal: Back returns to this list, Done closes it.
      onPress={() => router.push(row.href)}
      accessibilityRole="button"
      style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
    >
      {Thumbnail ? (
        <View style={styles.thumbnail}>
          <Thumbnail />
        </View>
      ) : null}
      <View style={styles.rowText}>
        <Text style={styles.name}>{row.name}</Text>
        <Text style={styles.description}>{row.description}</Text>
      </View>
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

function Separator() {
  return <View style={styles.separator} />;
}

function EmptyState() {
  return (
    <View style={styles.empty}>
      <Text style={styles.name}>No components yet.</Text>
      <Text style={styles.description}>
        Add one in <Text style={styles.code}>example/src/registry.ts</Text>.
      </Text>
    </View>
  );
}

/** Modal listing every component, grouped by category. */
export default function ComponentList() {
  return (
    <SectionList
      sections={SECTIONS}
      keyExtractor={(row) => row.key}
      renderItem={({ item }) => <ComponentRow row={item} />}
      renderSectionHeader={({ section }) => (
        <Text style={styles.sectionTitle}>{section.title}</Text>
      )}
      ListEmptyComponent={EmptyState}
      ItemSeparatorComponent={Separator}
      stickySectionHeadersEnabled={false}
      contentContainerStyle={styles.content}
    />
  );
}

const styles = StyleSheet.create({
  content: { padding: spacing.md },
  sectionTitle: {
    ...font.caption,
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.sm,
  },
  rowPressed: { backgroundColor: colors.card },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: colors.background,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowText: { flex: 1, gap: 2 },
  name: { ...font.title, color: colors.text },
  description: { ...font.caption, color: colors.textSecondary },
  chevron: { fontSize: 22, color: colors.textSecondary },
  separator: { height: spacing.xs },
  empty: { paddingVertical: spacing.lg, gap: spacing.sm },
  code: { fontFamily: 'Menlo', color: colors.text },
});
