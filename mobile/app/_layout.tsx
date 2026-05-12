import { Stack } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { AuthProvider, useAuth } from '../hooks/useAuth';
import { TenantProvider, useTenant } from '../hooks/useTenant';
import { StripeRoot } from '../components/StripeRoot';
import '../lib/i18n';

function RootNavigator() {
  const { loading } = useAuth();
  const { theme } = useTenant();
  if (loading) {
    return <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: theme.colors.background }}><ActivityIndicator color={theme.colors.primary} /></View>;
  }
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: theme.colors.background } }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="sobre" />
    </Stack>
  );
}

export default function Layout() {
  return (
    <StripeRoot>
      <AuthProvider>
        <TenantProvider>
          <RootNavigator />
        </TenantProvider>
      </AuthProvider>
    </StripeRoot>
  );
}
