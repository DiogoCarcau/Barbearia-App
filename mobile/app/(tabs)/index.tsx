import { router } from 'expo-router';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { FeedGrid } from '../../components/feed/FeedGrid';
import { LevelBadge } from '../../components/profile/LevelBadge';
import { useTenant } from '../../hooks/useTenant';

function greeting(name?: string | null) {
  const hour = new Date().getHours();
  const prefix = hour < 12 ? 'Bom dia' : hour < 20 ? 'Boa tarde' : 'Boa noite';
  return `${prefix}${name ? `, ${name.split(' ')[0]}` : ''}!`;
}

export default function HomeScreen() {
  const { t } = useTranslation();
  const { tenant, perfil, localizacoes, selectedLocationId, setSelectedLocationId, theme } = useTenant();
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 16, paddingBottom: 110 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: theme.colors.muted }}>{tenant?.nome}</Text>
          <Text style={{ color: theme.colors.text, fontSize: 26, fontWeight: '900' }}>{greeting(perfil?.nome)}</Text>
        </View>
        <Avatar uri={perfil?.avatar_url} name={perfil?.nome} />
      </View>
      <Card>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View><Text style={{ color: theme.colors.muted }}>{t('points')}</Text><Text style={{ color: theme.colors.text, fontSize: 30, fontWeight: '900' }}>{perfil?.pontos ?? 0}</Text></View>
          <LevelBadge perfil={perfil} />
        </View>
        <View style={{ height: 8, backgroundColor: theme.colors.surfaceAlt, borderRadius: 99 }}><View style={{ height: 8, width: `${Math.min(((perfil?.pontos ?? 0) % 100), 100)}%`, backgroundColor: theme.colors.primary, borderRadius: 99 }} /></View>
      </Card>
      {localizacoes.length > 1 ? <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>{localizacoes.map((loc) => <TouchableOpacity key={loc.id} onPress={() => setSelectedLocationId(loc.id)} style={{ width: 220, padding: 10, borderRadius: theme.radius, backgroundColor: loc.id === selectedLocationId ? theme.colors.primary : theme.colors.surface }}>{loc.fotos?.[0] ? <Image source={{ uri: loc.fotos[0] }} style={{ height: 90, borderRadius: 8 }} /> : null}<Text style={{ color: loc.id === selectedLocationId ? '#111214' : theme.colors.text, fontWeight: '900', marginTop: 8 }}>{loc.nome}</Text><Text style={{ color: loc.id === selectedLocationId ? '#111214' : theme.colors.muted }}>{loc.morada}</Text></TouchableOpacity>)}</ScrollView> : null}
      <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '900' }}>Feed</Text>
      <FeedGrid />
      <Button title={t('bookNow')} icon="calendar-outline" onPress={() => router.push('/(tabs)/agendar')} />
    </ScrollView>
  );
}
