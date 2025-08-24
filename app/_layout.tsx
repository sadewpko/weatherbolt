import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useAuth } from '@/hooks/useAuth';
import AuthScreen from '@/components/AuthScreen';
import LoadingSpinner from '@/components/LoadingSpinner';
import { View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function RootLayout() {
  useFrameworkReady();
  
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <LinearGradient
        colors={['#3b82f6', '#8b5cf6']}
        className="flex-1 items-center justify-center"
      >
        <LoadingSpinner size={50} />
      </LinearGradient>
    );
  }

  if (!user) {
    return <AuthScreen />;
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}