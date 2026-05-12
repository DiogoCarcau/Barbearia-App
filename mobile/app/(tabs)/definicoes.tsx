import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import type React from 'react';
import { Alert, ScrollView, Switch, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import i18n from '../../lib/i18n';

export default function DefinicoesScreen() {
  const { t } = useTranslation();
  const { signOut } = useAuth();
  const { theme, themeMode, setThemeMode } = useTenant();
  const [notifications, setNotifications] = useState(true);
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: 100 }}>
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900' }}>{t('settings')}</Text>
      <Card><Row label={t('darkMode')}><Switch value={themeMode === 'dark'} onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')} /></Row></Card>
      <Card><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{t('language')}</Text><View style={{ flexDirection: 'row', gap: 8 }}><Button title="Português" variant="secondary" onPress={() => i18n.changeLanguage('pt')} /><Button title="English" variant="secondary" onPress={() => i18n.changeLanguage('en')} /></View></Card>
      <Card><Row label={t('notifications')}><Switch value={notifications} onValueChange={async (value) => { setNotifications(value); await AsyncStorage.setItem('notifications', String(value)); }} /></Row></Card>
      <Card><Text style={{ color: theme.colors.text, fontWeight: '900' }}>Política de privacidade e Termos</Text><Text style={{ color: theme.colors.muted }}>Conteúdo legal carregável pelo tenant/admin.</Text></Card>
      <Button title={t('logout')} icon="log-out-outline" onPress={() => Alert.alert(t('logout'), 'Confirmas?', [{ text: 'Não' }, { text: 'Sim', onPress: () => signOut() }])} />
      <Button title={t('deleteAccount')} variant="danger" icon="trash-outline" onPress={() => Alert.alert('Eliminar conta', 'Esta ação precisa de confirmação dupla e deve chamar uma Edge Function segura.')} />
      <Button title="Sobre nós" variant="secondary" onPress={() => router.push('/sobre')} />
    </ScrollView>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  const { theme } = useTenant();
  return <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{label}</Text>{children}</View>;
}
