import * as Linking from 'expo-linking';
import { Image, ScrollView, Text, View } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTenant } from '../hooks/useTenant';

export default function SobreScreen() {
  const { tenant, barbeiros, localizacoes, theme } = useTenant();
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: 60 }}>
      {tenant?.logo_url ? <Image source={{ uri: tenant.logo_url }} style={{ width: 90, height: 90, borderRadius: 18 }} /> : null}
      <Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '900' }}>{tenant?.nome}</Text>
      <Text style={{ color: theme.colors.muted, lineHeight: 22 }}>{tenant?.descricao}</Text>
      <Card><Text style={{ color: theme.colors.text, fontWeight: '900', fontSize: 18 }}>Equipa</Text>{barbeiros.map((barbeiro) => <View key={barbeiro.id} style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}><Avatar uri={barbeiro.foto_url} name={barbeiro.nome} /><View><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{barbeiro.nome}</Text><Text style={{ color: theme.colors.muted }}>{barbeiro.especialidades.join(', ')}</Text></View></View>)}</Card>
      {localizacoes.map((loc) => <Card key={loc.id}><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{loc.nome}</Text><Text style={{ color: theme.colors.muted }}>{loc.morada}</Text><Button title="Como chegar" icon="navigate-outline" onPress={() => Linking.openURL(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.morada)}`)} /></Card>)}
      <Card><Text style={{ color: theme.colors.text, fontWeight: '900' }}>Contactos</Text>{tenant?.telefone ? <Button title={tenant.telefone} variant="secondary" icon="call-outline" onPress={() => Linking.openURL(`tel:${tenant.telefone}`)} /> : null}{tenant?.instagram_url ? <Button title="Instagram" variant="secondary" icon="logo-instagram" onPress={() => Linking.openURL(tenant.instagram_url!)} /> : null}{tenant?.facebook_url ? <Button title="Facebook" variant="secondary" icon="logo-facebook" onPress={() => Linking.openURL(tenant.facebook_url!)} /> : null}</Card>
    </ScrollView>
  );
}
