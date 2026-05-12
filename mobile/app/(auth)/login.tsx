import { Link, Redirect } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { signIn, signInWithGoogle, session } = useAuth();
  const { tenant, theme } = useTenant();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  if (session) return <Redirect href="/(tabs)" />;
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20, justifyContent: 'center', gap: 18 }}>
      <View style={{ alignItems: 'center', gap: 12 }}>
        {tenant?.logo_url ? <Image source={{ uri: tenant.logo_url }} style={{ width: 84, height: 84, borderRadius: 18 }} /> : null}
        <Text style={{ color: theme.colors.text, fontSize: 32, fontWeight: '900' }}>{tenant?.nome ?? t('noTenant')}</Text>
        {!tenant ? <Text style={{ color: theme.colors.muted, textAlign: 'center' }}>{t('configureTenant')}</Text> : null}
      </View>
      <Card>
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={email} onChangeText={setEmail} />
        <Input label="Password" secureTextEntry value={password} onChangeText={setPassword} />
        <Button title={t('login')} loading={loading} onPress={async () => {
          try { setLoading(true); await signIn(email, password); } catch (error: any) { Alert.alert('Login', error.message); } finally { setLoading(false); }
        }} />
        <Button title="Google" variant="secondary" icon="logo-google" onPress={() => signInWithGoogle().catch((error) => Alert.alert('Google', error.message))} />
        <Link href="/(auth)/register" style={{ color: theme.colors.primary, textAlign: 'center', fontWeight: '900' }}>{t('register')}</Link>
        <Link href="/(auth)/forgot-password" style={{ color: theme.colors.muted, textAlign: 'center' }}>{t('forgotPassword')}</Link>
      </Card>
    </View>
  );
}
