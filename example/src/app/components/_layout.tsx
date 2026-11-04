import { Stack, router } from 'expo-router';
import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, font } from '../../theme';

function DoneButton() {
  return (
    <Pressable
      // dismiss() would only pop this inner stack; go all the way back to the front page.
      onPress={() => router.dismissTo('/')}
      accessibilityRole="button"
      hitSlop={8}
    >
      <Text style={styles.done}>Done</Text>
    </Pressable>
  );
}

/**
 * Stack inside the full-screen modal: the categorised list, then one playground per
 * component (`/components/<slug>`). Back returns to the list; Done closes the modal.
 */
export default function ComponentsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.background },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
        headerRight: DoneButton,
      }}
    >
      <Stack.Screen name="index" options={{ title: 'Components' }} />
      <Stack.Screen
        name="dev/hello-shader"
        options={{ title: 'Hello shader' }}
      />
    </Stack>
  );
}

const styles = StyleSheet.create({
  done: { ...font.body, fontWeight: '600', color: colors.accent },
});
