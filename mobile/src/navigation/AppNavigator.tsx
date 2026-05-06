import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../contexts/AppContext';
import { AboutScreen, AuthScreen, BookingFlowScreen, BookingsScreen, HomeScreen, ProfileScreen, SettingsScreen } from './screens';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function MainTabs() {
  const { t } = useTranslation();
  const { theme } = useApp();
  const dark = theme === 'dark';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: dark ? '#111214' : '#FFFFFF',
          borderTopColor: dark ? '#2A2B30' : '#E6E2D8',
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#C7A85A',
        tabBarInactiveTintColor: dark ? '#A9A9A9' : '#555',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            Home: 'home-outline',
            Book: 'calendar-outline',
            Bookings: 'list-outline',
            Profile: 'person-outline',
            Settings: 'settings-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home') }} />
      <Tab.Screen name="Book" component={BookingFlowScreen} options={{ title: t('schedule') }} />
      <Tab.Screen name="Bookings" component={BookingsScreen} options={{ title: t('bookings') }} />
      <Tab.Screen name="Profile" component={ProfileScreen} options={{ title: t('profile') }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ title: t('settings') }} />
    </Tab.Navigator>
  );
}

export function AppNavigator() {
  const { user } = useApp();
  if (!user) return <AuthScreen />;
  return (
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <Stack.Screen name="Sobre Nós" component={AboutScreen} options={{ headerStyle: { backgroundColor: '#111214' }, headerTintColor: '#C7A85A' }} />
    </Stack.Navigator>
  );
}
