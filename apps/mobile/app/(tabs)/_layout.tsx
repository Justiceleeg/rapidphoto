import { Tabs } from 'expo-router';

export default function TabsLayout() {
  // For now, don't check auth - we'll add that back later
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
    </Tabs>
  );
}

