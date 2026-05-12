import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, View, Text } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';

export default function ForgotPasswordScreen() {
  const { resetPassword } = useAuth();
  const { theme } = useTenant();
  const [email, setEmail] = useState('');
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background, padding: 20, justifyContent: 'center' }}>
      <Card>
        <Text style={{ color: theme.colors.text, fontSize: 24, fontWeight: '900' }}>Recuperar password</Text>
        <Input label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
        <Button title="Enviar email" onPress={async () => { await resetPassword(email); Alert.alert('Email enviado'); router.back(); }} />
      </Card>
    </View>
  );
}
