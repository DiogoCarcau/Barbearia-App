import { Link, router } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, Text } from 'react-native';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';

export default function RegisterScreen() {
  const { signUp } = useAuth();
  const { tenant, theme } = useTenant();
  const [form, setForm] = useState({ nome: '', email: '', password: '', telefone: '', data_nascimento: '' });
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 20, gap: 16 }}>
      <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '900' }}>Criar conta</Text>
      <Card>
        <Input label="Nome" value={form.nome} onChangeText={(nome) => setForm({ ...form, nome })} />
        <Input label="Email" autoCapitalize="none" keyboardType="email-address" value={form.email} onChangeText={(email) => setForm({ ...form, email })} />
        <Input label="Password" secureTextEntry value={form.password} onChangeText={(password) => setForm({ ...form, password })} />
        <Input label="Telefone" value={form.telefone} onChangeText={(telefone) => setForm({ ...form, telefone })} />
        <Input label="Data nascimento" placeholder="YYYY-MM-DD" value={form.data_nascimento} onChangeText={(data_nascimento) => setForm({ ...form, data_nascimento })} />
        <Button title="Criar conta" onPress={async () => {
          if (!tenant) return Alert.alert('Tenant', 'Esta app ainda não tem tenant carregado.');
          try { await signUp({ ...form, tenant_id: tenant.id }); router.replace('/(tabs)'); } catch (error: any) { Alert.alert('Registo', error.message); }
        }} />
        <Link href="/(auth)/login" style={{ color: theme.colors.primary, textAlign: 'center' }}>Já tenho conta</Link>
      </Card>
    </ScrollView>
  );
}
