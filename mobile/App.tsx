import React from 'react';
import { NavigationContainer, DarkTheme, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { StripeProvider } from '@stripe/stripe-react-native';
import { AppNavigator } from './src/navigation/AppNavigator';
import { AppProvider, useApp } from './src/contexts/AppContext';
import './src/i18n';

function Root() {
  const { theme } = useApp();
  return (
    <NavigationContainer theme={theme === 'dark' ? DarkTheme : DefaultTheme}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <AppNavigator />
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ''}>
      <AppProvider>
        <Root />
      </AppProvider>
    </StripeProvider>
  );
}
