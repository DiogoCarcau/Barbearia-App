import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Image, ImageBackground, Platform, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { useApp } from '../contexts/AppContext';
import { supabase } from '../services/supabase';

const gold = '#C7A85A';
const darkBg = '#17181D';
const lightBg = '#F7F3EA';
const placeholderAvatar = 'https://images.unsplash.com/photo-1595152772835-219674b2a8a6?w=500';

const locations = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    name: 'Barbearia Central',
    city: 'Lisboa',
    address: 'Rua Garrett 32, Lisboa',
    phone: '+351910000000',
    cover: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=1200',
    coords: { latitude: 38.7105, longitude: -9.1418 },
    hours: 'Seg-Sab 09:00-20:00',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    name: 'Studio Norte',
    city: 'Porto',
    address: 'Rua das Flores 88, Porto',
    phone: '+351920000000',
    cover: 'https://images.unsplash.com/photo-1512690459411-b9245aed614b?w=1200',
    coords: { latitude: 41.1457, longitude: -8.6109 },
    hours: 'Ter-Dom 10:00-21:00',
  },
];

const services = [
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1', namePt: 'Corte normal', nameEn: 'Classic cut', price: 18, duration: 30 },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa2', namePt: 'Degradê', nameEn: 'Fade', price: 22, duration: 40 },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa3', namePt: 'Cabelo + Barba', nameEn: 'Hair + Beard', price: 32, duration: 60 },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa4', namePt: 'Barba à máquina', nameEn: 'Machine beard trim', price: 12, duration: 20 },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa5', namePt: 'Tratamento de sobrancelha', nameEn: 'Eyebrow treatment', price: 8, duration: 15 },
  { id: 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa6', namePt: 'Sobrancelha à navalha', nameEn: 'Razor eyebrow detail', price: 10, duration: 15 },
];

const barbers = [
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1', name: 'Tiago Mendes', locationId: '11111111-1111-4111-8111-111111111111', rating: 4.9, photo: 'https://images.unsplash.com/photo-1618077360395-f3068be8e001?w=500' },
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb2', name: 'Mara Silva', locationId: '11111111-1111-4111-8111-111111111111', rating: 4.8, photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500' },
  { id: 'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb3', name: 'Rui Costa', locationId: '22222222-2222-4222-8222-222222222222', rating: 4.9, photo: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=500' },
];

const feed = [
  { id: '1', titlePt: 'Degradê em progresso', titleEn: 'Fade in progress', locationId: '11111111-1111-4111-8111-111111111111', image: 'https://images.unsplash.com/photo-1622287162716-f311baa1a2b8?w=1200' },
  { id: '2', titlePt: 'Finalização clássica', titleEn: 'Classic finish', locationId: '11111111-1111-4111-8111-111111111111', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=1200' },
  { id: '3', titlePt: 'Equipa em ação', titleEn: 'Team at work', locationId: '22222222-2222-4222-8222-222222222222', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1200' },
];

const upcoming = [
  { id: 'a1', date: '13/05/2026', hour: '16:30', service: 'Degradê', barber: 'Tiago Mendes', location: 'Barbearia Central', status: 'confirmado' },
  { id: 'a2', date: '28/05/2026', hour: '11:00', service: 'Cabelo + Barba', barber: 'Rui Costa', location: 'Studio Norte', status: 'pendente' },
];

const past = [
  { id: 'h1', date: '04/04/2026', service: 'Corte normal', total: 18 },
  { id: 'h2', date: '21/03/2026', service: 'Barba à máquina', total: 12 },
];

function usePalette() {
  const { theme } = useApp();
  const dark = theme === 'dark';
  return {
    dark,
    bg: dark ? darkBg : lightBg,
    surface: dark ? '#24262C' : '#FFFFFF',
    soft: dark ? '#30323A' : '#ECE4D5',
    text: dark ? '#FFFFFF' : '#17181D',
    muted: dark ? '#B7B7B7' : '#5E5A50',
    border: dark ? '#3B3D45' : '#E2D7C2',
  };
}

function serviceName(service: typeof services[number], lang: string) {
  return lang === 'en' ? service.nameEn : service.namePt;
}

function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const p = usePalette();
  return <View style={[styles.card, { backgroundColor: p.surface, borderColor: p.border }, style]}>{children}</View>;
}

function Pill({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  const p = usePalette();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.pill, { backgroundColor: active ? gold : p.soft, borderColor: active ? gold : p.border }]}>
      <Text style={{ color: active ? '#111214' : p.text, fontWeight: '800' }}>{label}</Text>
    </TouchableOpacity>
  );
}

function PrimaryButton({ label, icon, onPress }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.primaryButton}>
      {icon ? <Ionicons name={icon} size={18} color="#111214" /> : null}
      <Text style={styles.primaryButtonText}>{label}</Text>
    </TouchableOpacity>
  );
}

function SecondaryButton({ label, icon, onPress }: { label: string; icon?: keyof typeof Ionicons.glyphMap; onPress: () => void }) {
  const p = usePalette();
  return (
    <TouchableOpacity onPress={onPress} style={[styles.secondaryButton, { borderColor: p.border, backgroundColor: p.soft }]}>
      {icon ? <Ionicons name={icon} size={18} color={p.text} /> : null}
      <Text style={{ color: p.text, fontWeight: '800' }}>{label}</Text>
    </TouchableOpacity>
  );
}

export const AuthScreen = () => {
  const p = usePalette();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signIn = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) Alert.alert('Login', error.message);
  };

  const signUp = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    Alert.alert(error ? 'Registo' : 'Registo criado', error?.message ?? 'Confirma o email para ativar a conta.');
  };

  const google = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: Linking.createURL('/') } });
    if (error) Alert.alert('Google', error.message);
  };

  return (
    <ImageBackground source={{ uri: locations[0].cover }} style={styles.authHero} imageStyle={{ opacity: 0.35 }}>
      <View style={styles.authOverlay}>
        <View style={styles.logoMark}><Text style={styles.logoText}>XB</Text></View>
        <Text style={styles.authTitle}>X Barber</Text>
        <Text style={styles.authSubtitle}>{t('welcome')}</Text>
        <View style={[styles.loginPanel, { backgroundColor: p.dark ? 'rgba(23,24,29,0.92)' : 'rgba(255,255,255,0.94)' }]}>
          <TextInput value={email} onChangeText={setEmail} placeholder="email@exemplo.com" autoCapitalize="none" keyboardType="email-address" placeholderTextColor={p.muted} style={[styles.input, { color: p.text, borderColor: p.border }]} />
          <TextInput value={password} onChangeText={setPassword} placeholder="password" secureTextEntry placeholderTextColor={p.muted} style={[styles.input, { color: p.text, borderColor: p.border }]} />
          <PrimaryButton label={loading ? '...' : t('login')} icon="log-in-outline" onPress={signIn} />
          <SecondaryButton label="Criar conta" icon="person-add-outline" onPress={signUp} />
          <SecondaryButton label={t('google')} icon="logo-google" onPress={google} />
        </View>
      </View>
    </ImageBackground>
  );
};

export const HomeScreen = ({ navigation }: any) => {
  const p = usePalette();
  const { t } = useTranslation();
  const { lang, user } = useApp();
  const [locationId, setLocationId] = useState(locations[0].id);
  const selected = locations.find((item) => item.id === locationId) ?? locations[0];
  const posts = feed.filter((item) => item.locationId === locationId || locations.length === 1);
  const name = user?.user_metadata?.full_name?.split(' ')[0] ?? 'João';

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <View style={styles.header}>
        <View>
          <Text style={[styles.eyebrow, { color: gold }]}>{selected.city}</Text>
          <Text style={[styles.title, { color: p.text }]}>{t('helloName', { name })}</Text>
        </View>
        <Image source={{ uri: user?.user_metadata?.avatar_url ?? placeholderAvatar }} style={styles.avatar} />
      </View>

      <Card style={styles.balanceCard}>
        <View>
          <Text style={[styles.muted, { color: '#111214' }]}>{t('loyalty')}</Text>
          <Text style={styles.balanceText}>120 pts</Text>
        </View>
        <View style={styles.levelBadge}><Text style={styles.levelText}>Prata</Text></View>
      </Card>

      {locations.length > 1 ? (
        <View style={styles.locationRow}>
          {locations.map((loc) => (
            <TouchableOpacity key={loc.id} onPress={() => setLocationId(loc.id)} style={[styles.locationTile, { borderColor: loc.id === locationId ? gold : p.border }]}>
              <Image source={{ uri: loc.cover }} style={styles.locationImage} />
              <Text style={[styles.locationName, { color: p.text }]}>{loc.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}

      <View style={styles.quickActions}>
        <PrimaryButton label={t('schedule')} icon="calendar-outline" onPress={() => navigation.navigate('Book')} />
        <SecondaryButton label={t('appointments')} icon="list-outline" onPress={() => navigation.navigate('Bookings')} />
        <SecondaryButton label={t('offers')} icon="gift-outline" onPress={() => Alert.alert('Ofertas', '10% em Cabelo + Barba esta semana.')} />
      </View>

      <Text style={[styles.sectionTitle, { color: p.text }]}>Feed</Text>
      {posts.map((post) => (
        <Card key={post.id} style={{ padding: 0, overflow: 'hidden' }}>
          <Image source={{ uri: post.image }} style={styles.feedImage} />
          <View style={styles.feedFooter}>
            <Text style={[styles.cardTitle, { color: p.text }]}>{lang === 'en' ? post.titleEn : post.titlePt}</Text>
            <Ionicons name="heart-outline" size={22} color={gold} />
          </View>
        </Card>
      ))}
      <SecondaryButton label={t('about')} icon="information-circle-outline" onPress={() => navigation.navigate('Sobre Nós')} />
    </ScrollView>
  );
};

export const BookingFlowScreen = () => {
  const p = usePalette();
  const { t } = useTranslation();
  const { lang, notifications, user } = useApp();
  const [step, setStep] = useState(1);
  const [locationId, setLocationId] = useState(locations[0].id);
  const [serviceId, setServiceId] = useState(services[0].id);
  const [barberId, setBarberId] = useState(barbers[0].id);
  const [date, setDate] = useState('2026-05-13');
  const [hour, setHour] = useState('16:30');
  const chosenLocation = locations.find((item) => item.id === locationId) ?? locations[0];
  const availableBarbers = barbers.filter((item) => item.locationId === locationId);
  const chosenService = services.find((item) => item.id === serviceId) ?? services[0];
  const chosenBarber = barbers.find((item) => item.id === barberId) ?? availableBarbers[0] ?? barbers[0];
  const slots = ['09:30', '10:00', '11:30', '14:00', '16:30', '18:00'];

  const confirm = async () => {
    if (notifications) {
      await Notifications.scheduleNotificationAsync({
        content: { title: 'Agendamento confirmado', body: `${serviceName(chosenService, lang)} - ${hour}` },
        trigger: null,
      });
    }
    await supabase.from('agendamentos').insert({
      utilizador_id: user?.id,
      localizacao_id: locationId,
      barbeiro_id: barberId,
      servico_id: serviceId,
      data: date,
      hora: hour,
      estado: 'confirmado',
    });
    Alert.alert('Agendamento confirmado', 'Resumo enviado por push e preparado para email via Supabase Edge Function.');
    setStep(1);
  };

  const next = () => (step < 5 ? setStep(step + 1) : confirm());

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <Text style={[styles.title, { color: p.text }]}>{t('schedule')}</Text>
      <View style={styles.stepper}>{[1, 2, 3, 4, 5].map((item) => <View key={item} style={[styles.stepDot, { backgroundColor: item <= step ? gold : p.soft }]} />)}</View>

      {step === 1 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: p.text }]}>1. {lang === 'en' ? 'Choose location' : 'Escolher localização'}</Text>
          {locations.map((loc) => <Pill key={loc.id} label={`${loc.name} · ${loc.city}`} active={loc.id === locationId} onPress={() => { setLocationId(loc.id); setBarberId(barbers.find((barber) => barber.locationId === loc.id)?.id ?? barberId); }} />)}
        </Card>
      ) : null}

      {step === 2 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: p.text }]}>2. {lang === 'en' ? 'Choose service' : 'Escolher serviço'}</Text>
          {services.map((service) => (
            <TouchableOpacity key={service.id} onPress={() => setServiceId(service.id)} style={[styles.optionRow, { borderColor: service.id === serviceId ? gold : p.border }]}>
              <View>
                <Text style={[styles.cardTitle, { color: p.text }]}>{serviceName(service, lang)}</Text>
                <Text style={[styles.muted, { color: p.muted }]}>{service.duration} min</Text>
              </View>
              <Text style={[styles.price, { color: gold }]}>{service.price}€</Text>
            </TouchableOpacity>
          ))}
        </Card>
      ) : null}

      {step === 3 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: p.text }]}>3. {lang === 'en' ? 'Choose barber' : 'Escolher barbeiro'}</Text>
          {availableBarbers.map((barber) => (
            <TouchableOpacity key={barber.id} onPress={() => setBarberId(barber.id)} style={[styles.barberRow, { borderColor: barber.id === barberId ? gold : p.border }]}>
              <Image source={{ uri: barber.photo }} style={styles.barberPhoto} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.cardTitle, { color: p.text }]}>{barber.name}</Text>
                <Text style={[styles.muted, { color: p.muted }]}>★ {barber.rating}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </Card>
      ) : null}

      {step === 4 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: p.text }]}>4. {lang === 'en' ? 'Date and time' : 'Data e hora'}</Text>
          <View style={styles.locationRow}>{['2026-05-13', '2026-05-14', '2026-05-15'].map((item) => <Pill key={item} label={item.slice(5)} active={date === item} onPress={() => setDate(item)} />)}</View>
          <View style={styles.slotGrid}>{slots.map((item) => <Pill key={item} label={item} active={hour === item} onPress={() => setHour(item)} />)}</View>
        </Card>
      ) : null}

      {step === 5 ? (
        <Card>
          <Text style={[styles.sectionTitle, { color: p.text }]}>5. {lang === 'en' ? 'Confirm' : 'Confirmar'}</Text>
          <Text style={[styles.summaryLine, { color: p.text }]}>{chosenLocation.name}</Text>
          <Text style={[styles.summaryLine, { color: p.text }]}>{serviceName(chosenService, lang)} · {chosenService.price}€ · {chosenService.duration} min</Text>
          <Text style={[styles.summaryLine, { color: p.text }]}>{chosenBarber.name}</Text>
          <Text style={[styles.summaryLine, { color: p.text }]}>{date} · {hour}</Text>
          <Text style={[styles.muted, { color: p.muted }]}>Stripe PaymentIntent: preparado para Edge Function.</Text>
        </Card>
      ) : null}

      <View style={styles.navButtons}>
        {step > 1 ? <SecondaryButton label="Voltar" icon="chevron-back-outline" onPress={() => setStep(step - 1)} /> : null}
        <PrimaryButton label={step < 5 ? t('next') : t('confirm')} icon={step < 5 ? 'chevron-forward-outline' : 'checkmark-outline'} onPress={next} />
      </View>
    </ScrollView>
  );
};

export const BookingsScreen = () => {
  const p = usePalette();
  const { t } = useTranslation();
  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <Text style={[styles.title, { color: p.text }]}>{t('appointments')}</Text>
      <Text style={[styles.sectionTitle, { color: p.text }]}>Próximos</Text>
      {upcoming.map((booking) => (
        <Card key={booking.id}>
          <Text style={[styles.cardTitle, { color: p.text }]}>{booking.service}</Text>
          <Text style={[styles.muted, { color: p.muted }]}>{booking.date} · {booking.hour} · {booking.barber}</Text>
          <Text style={[styles.muted, { color: p.muted }]}>{booking.location} · {booking.status}</Text>
          <SecondaryButton label="Cancelar até 12h antes" icon="close-circle-outline" onPress={() => Alert.alert('Cancelamento', 'O agendamento foi marcado como cancelado.')} />
        </Card>
      ))}
      <Text style={[styles.sectionTitle, { color: p.text }]}>{t('history')}</Text>
      {past.map((booking) => (
        <Card key={booking.id} style={styles.historyRow}>
          <Text style={[styles.cardTitle, { color: p.text }]}>{booking.service}</Text>
          <Text style={[styles.price, { color: gold }]}>{booking.total}€</Text>
        </Card>
      ))}
    </ScrollView>
  );
};

export const ProfileScreen = () => {
  const p = usePalette();
  const { user } = useApp();
  const [avatar, setAvatar] = useState<string>(user?.user_metadata?.avatar_url ?? placeholderAvatar);
  const [name, setName] = useState(user?.user_metadata?.full_name ?? 'João Almeida');
  const [phone, setPhone] = useState('+351 910 000 000');
  const visits = 14;
  const level = visits >= 20 ? 'Ouro' : visits >= 10 ? 'Prata' : 'Bronze';

  const pickImage = async (camera = false) => {
    const result = camera ? await ImagePicker.launchCameraAsync({ quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ quality: 0.8 });
    if (!result.canceled) setAvatar(result.assets[0].uri);
  };

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <Text style={[styles.title, { color: p.text }]}>Perfil</Text>
      <View style={styles.profileTop}>
        <Image source={{ uri: avatar }} style={styles.profileAvatar} />
        <View style={{ flex: 1, gap: 8 }}>
          <SecondaryButton label="Galeria" icon="images-outline" onPress={() => pickImage(false)} />
          <SecondaryButton label="Câmara" icon="camera-outline" onPress={() => pickImage(true)} />
        </View>
      </View>
      <Card>
        <TextInput value={name} onChangeText={setName} style={[styles.input, { color: p.text, borderColor: p.border }]} />
        <TextInput value={user?.email ?? 'joao@email.com'} editable={false} style={[styles.input, { color: p.muted, borderColor: p.border }]} />
        <TextInput value={phone} onChangeText={setPhone} style={[styles.input, { color: p.text, borderColor: p.border }]} />
        <TextInput value="1995-05-21" style={[styles.input, { color: p.text, borderColor: p.border }]} />
      </Card>
      <Card>
        <Text style={[styles.cardTitle, { color: p.text }]}>Estatísticas</Text>
        <Text style={[styles.summaryLine, { color: p.text }]}>Já cortaste o cabelo aqui {visits} vezes</Text>
        <Text style={[styles.summaryLine, { color: p.text }]}>Total gasto: 312€</Text>
        <Text style={[styles.summaryLine, { color: p.text }]}>Membro desde: 04/05/2026</Text>
        <View style={styles.levelBadge}><Text style={styles.levelText}>{level}</Text></View>
      </Card>
    </ScrollView>
  );
};

export const AboutScreen = () => {
  const p = usePalette();
  const selected = locations[0];
  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <Image source={{ uri: selected.cover }} style={styles.aboutCover} />
      <Text style={[styles.title, { color: p.text }]}>Sobre Nós</Text>
      <Text style={[styles.bodyText, { color: p.muted }]}>Nascemos para juntar precisão, conversa boa e uma experiência sem esperas. A nossa equipa combina cortes clássicos, degradês modernos, barba e cuidado de sobrancelha.</Text>
      <Card>
        <Text style={[styles.cardTitle, { color: p.text }]}>Equipa</Text>
        {barbers.filter((barber) => barber.locationId === selected.id).map((barber) => <Text key={barber.id} style={[styles.summaryLine, { color: p.text }]}>{barber.name} · ★ {barber.rating}</Text>)}
      </Card>
      {Platform.OS !== 'web' ? (
        <MapView style={styles.map} initialRegion={{ ...selected.coords, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
          <Marker coordinate={selected.coords} title={selected.name} description={selected.address} />
        </MapView>
      ) : null}
      <Card>
        <Text style={[styles.summaryLine, { color: p.text }]}>{selected.address}</Text>
        <Text style={[styles.summaryLine, { color: p.text }]}>{selected.hours}</Text>
        <SecondaryButton label={selected.phone} icon="call-outline" onPress={() => Linking.openURL(`tel:${selected.phone}`)} />
        <SecondaryButton label="Instagram" icon="logo-instagram" onPress={() => Linking.openURL('instagram://user?username=xbbarbearia')} />
        <SecondaryButton label="Facebook" icon="logo-facebook" onPress={() => Linking.openURL('fb://page/123456')} />
      </Card>
    </ScrollView>
  );
};

export const SettingsScreen = () => {
  const p = usePalette();
  const { t } = useTranslation();
  const { theme, setTheme, lang, setLang, notifications, setNotifications, signOut } = useApp();
  const currentLangLabel = useMemo(() => (lang === 'pt' ? 'Português' : 'English'), [lang]);

  const logout = () => Alert.alert(t('logout'), 'Tens a certeza?', [
    { text: 'Cancelar', style: 'cancel' },
    { text: t('logout'), style: 'destructive', onPress: signOut },
  ]);

  return (
    <ScrollView style={{ backgroundColor: p.bg }} contentContainerStyle={styles.screen}>
      <Text style={[styles.title, { color: p.text }]}>{t('settings')}</Text>
      <Card style={styles.settingRow}>
        <Text style={[styles.cardTitle, { color: p.text }]}>{t('darkMode')}</Text>
        <Switch value={theme === 'dark'} onValueChange={(value) => setTheme(value ? 'dark' : 'light')} thumbColor={theme === 'dark' ? gold : '#F4F3F4'} />
      </Card>
      <Card>
        <Text style={[styles.cardTitle, { color: p.text }]}>{t('language')}: {currentLangLabel}</Text>
        <View style={styles.locationRow}>
          <Pill label="Português" active={lang === 'pt'} onPress={() => setLang('pt')} />
          <Pill label="English" active={lang === 'en'} onPress={() => setLang('en')} />
        </View>
      </Card>
      <Card style={styles.settingRow}>
        <Text style={[styles.cardTitle, { color: p.text }]}>{t('notifications')}</Text>
        <Switch value={notifications} onValueChange={setNotifications} thumbColor={notifications ? gold : '#F4F3F4'} />
      </Card>
      <Card>
        <Text style={[styles.cardTitle, { color: p.text }]}>{t('terms')}</Text>
        <Text style={[styles.muted, { color: p.muted }]}>Política pronta para ligar ao teu documento legal e versão pública.</Text>
      </Card>
      <PrimaryButton label={t('logout')} icon="log-out-outline" onPress={logout} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  screen: { padding: 18, paddingBottom: 96, gap: 14 },
  authHero: { flex: 1, backgroundColor: '#111214' },
  authOverlay: { flex: 1, padding: 24, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.45)' },
  logoMark: { width: 72, height: 72, borderRadius: 18, backgroundColor: '#111214', borderWidth: 1, borderColor: gold, alignItems: 'center', justifyContent: 'center' },
  logoText: { color: gold, fontSize: 30, fontWeight: '900' },
  authTitle: { color: '#FFFFFF', fontSize: 42, fontWeight: '900', marginTop: 18 },
  authSubtitle: { color: '#EFE7D7', fontSize: 17, marginBottom: 26 },
  loginPanel: { borderRadius: 8, padding: 16, gap: 10 },
  input: { borderWidth: 1, borderRadius: 8, padding: 13, fontSize: 15, marginBottom: 10 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 14 },
  title: { fontSize: 28, fontWeight: '900' },
  eyebrow: { fontSize: 12, textTransform: 'uppercase', fontWeight: '900', letterSpacing: 0 },
  avatar: { width: 48, height: 48, borderRadius: 24 },
  card: { borderWidth: 1, borderRadius: 8, padding: 16, gap: 10 },
  balanceCard: { backgroundColor: gold, borderColor: gold, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  balanceText: { color: '#111214', fontSize: 30, fontWeight: '900' },
  muted: { fontSize: 13, lineHeight: 19 },
  levelBadge: { alignSelf: 'flex-start', backgroundColor: '#111214', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999 },
  levelText: { color: gold, fontWeight: '900' },
  locationRow: { flexDirection: 'row', gap: 10, flexWrap: 'wrap' },
  locationTile: { width: '48%', borderWidth: 2, borderRadius: 8, padding: 8, gap: 8 },
  locationImage: { height: 90, borderRadius: 6 },
  locationName: { fontWeight: '900', fontSize: 13 },
  quickActions: { gap: 10 },
  primaryButton: { minHeight: 48, borderRadius: 8, backgroundColor: gold, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 14 },
  primaryButtonText: { color: '#111214', fontWeight: '900', fontSize: 15 },
  secondaryButton: { minHeight: 46, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 14 },
  sectionTitle: { fontSize: 18, fontWeight: '900', marginTop: 4 },
  cardTitle: { fontSize: 16, fontWeight: '900' },
  feedImage: { width: '100%', height: 280 },
  feedFooter: { padding: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pill: { borderRadius: 999, borderWidth: 1, paddingVertical: 10, paddingHorizontal: 14 },
  stepper: { flexDirection: 'row', gap: 8 },
  stepDot: { flex: 1, height: 5, borderRadius: 99 },
  optionRow: { borderWidth: 1, borderRadius: 8, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  price: { fontSize: 16, fontWeight: '900' },
  barberRow: { borderWidth: 1, borderRadius: 8, padding: 10, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 },
  barberPhoto: { width: 58, height: 58, borderRadius: 29 },
  slotGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  navButtons: { flexDirection: 'row', gap: 10, alignItems: 'center', justifyContent: 'flex-end' },
  summaryLine: { fontSize: 15, lineHeight: 23 },
  historyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  profileAvatar: { width: 116, height: 116, borderRadius: 58, borderWidth: 2, borderColor: gold },
  aboutCover: { height: 190, borderRadius: 8 },
  bodyText: { fontSize: 15, lineHeight: 23 },
  map: { height: 220, borderRadius: 8 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});
