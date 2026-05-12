import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { LevelBadge } from '../../components/profile/LevelBadge';
import { StatsCard } from '../../components/profile/StatsCard';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { useAuth } from '../../hooks/useAuth';
import { useTenant } from '../../hooks/useTenant';
import { supabase } from '../../lib/supabase';

export default function PerfilScreen() {
  const { user } = useAuth();
  const { perfil, tenant, theme, refresh } = useTenant();
  const { agendamentos } = useAgendamentos();
  const [form, setForm] = useState({ nome: perfil?.nome ?? '', email: perfil?.email ?? user?.email ?? '', telefone: perfil?.telefone ?? '', data_nascimento: perfil?.data_nascimento ?? '' });

  async function uploadAvatar() {
    const result = await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (result.canceled || !tenant || !user) return;
    const file = await fetch(result.assets[0].uri).then((res) => res.blob());
    const path = `${tenant.id}/${user.id}-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(path, file, { upsert: true, contentType: 'image/jpeg' });
    if (error) return Alert.alert('Avatar', error.message);
    const { data } = supabase.storage.from('avatars').getPublicUrl(path);
    await supabase.from('utilizadores').update({ avatar_url: data.publicUrl }).eq('id', user.id).eq('tenant_id', tenant.id);
    refresh();
  }

  async function save() {
    if (!tenant || !user) return;
    const { error } = await supabase.from('utilizadores').update(form).eq('id', user.id).eq('tenant_id', tenant.id);
    if (error) Alert.alert('Perfil', error.message); else refresh();
  }

  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: 100 }}>
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900' }}>Perfil</Text>
      <Card><View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}><Avatar uri={perfil?.avatar_url} name={perfil?.nome} size={86} /><View style={{ flex: 1 }}><LevelBadge perfil={perfil} /><Text style={{ color: theme.colors.muted, marginTop: 8 }}>{perfil?.pontos ?? 0} pontos</Text></View></View><Button title="Editar avatar" icon="camera-outline" onPress={uploadAvatar} /></Card>
      <Card><Input label="Nome" value={form.nome} onChangeText={(nome) => setForm({ ...form, nome })} /><Input label="Email" value={form.email} onChangeText={(email) => setForm({ ...form, email })} /><Input label="Telefone" value={form.telefone} onChangeText={(telefone) => setForm({ ...form, telefone })} /><Input label="Data nascimento" value={form.data_nascimento ?? ''} onChangeText={(data_nascimento) => setForm({ ...form, data_nascimento })} /><Button title="Guardar" onPress={save} /></Card>
      <StatsCard />
      <Card><Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18 }}>Últimos agendamentos</Text>{agendamentos.slice(0, 3).map((item) => <Text key={item.id} style={{ color: theme.colors.muted }}>{item.data} · {item.servicos?.nome}</Text>)}</Card>
    </ScrollView>
  );
}
