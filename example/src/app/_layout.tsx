import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { colors } from '../theme';

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="index" />
        {/* The component browser: its own stack, shown as a full-screen modal. */}
        <Stack.Screen
          name="components"
          options={{ presentation: 'fullScreenModal' }}
        />
      </Stack>
    </>
  );
}
