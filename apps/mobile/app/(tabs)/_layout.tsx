import { Tabs, Redirect } from 'expo-router';
import { useAuth } from '@/lib/hooks/use-auth';
import { ActivityIndicator } from 'react-native';
import { YStack } from 'tamagui';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
    </Tabs>
  );
}

