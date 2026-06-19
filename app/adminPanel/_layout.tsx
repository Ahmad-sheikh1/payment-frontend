import { Stack } from 'expo-router';

export default function AdminPanelRootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="shop" />
      <Stack.Screen name="restaurant" />
    </Stack>
  );
}
