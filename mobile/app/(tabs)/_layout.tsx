import { Ionicons } from '@expo/vector-icons';
import { Redirect, Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';

export default function TabsLayout() {
  const { session, loading } = useAuth();
  const { t } = useTranslation();
  const { theme } = useTenant();
  if (!loading && !session) return <Redirect href="/(auth)/login" />;
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.muted,
        tabBarStyle: { backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border, height: 68, paddingBottom: 10 },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
            index: 'home-outline',
            agendar: 'calendar-outline',
            agendamentos: 'list-outline',
            perfil: 'person-outline',
            definicoes: 'settings-outline',
          };
          return <Ionicons name={icons[route.name] ?? 'ellipse-outline'} color={color} size={size} />;
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: t('home') }} />
      <Tabs.Screen name="agendar" options={{ title: t('book') }} />
      <Tabs.Screen name="agendamentos" options={{ title: t('bookings') }} />
      <Tabs.Screen name="perfil" options={{ title: t('profile') }} />
      <Tabs.Screen name="definicoes" options={{ title: t('settings') }} />
    </Tabs>
  );
}
