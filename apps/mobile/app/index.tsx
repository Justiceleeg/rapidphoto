import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/hooks/use-auth';
import { ActivityIndicator } from 'react-native';
import { YStack } from 'tamagui';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center" backgroundColor="$background">
        <ActivityIndicator size="large" />
      </YStack>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

