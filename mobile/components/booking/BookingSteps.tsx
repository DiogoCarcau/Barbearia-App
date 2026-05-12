import { useMemo, useState } from 'react';
import type React from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../hooks/useAuth';
import { useBarbeiros } from '../../hooks/useBarbeiros';
import { useServicos } from '../../hooks/useServicos';
import { useTenant } from '../../hooks/useTenant';
import { supabase } from '../../lib/supabase';
import { addBookingToCalendar, notifyBookingConfirmed } from '../../lib/notifications';
import { Barbeiro, Localizacao, Servico } from '../../lib/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';

const categories = ['corte', 'barba', 'sobrancelha', 'tratamento', 'outro'] as const;

export function BookingSteps() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { tenant, localizacoes, selectedLocationId, setSelectedLocationId, theme } = useTenant();
  const { servicos } = useServicos();
  const [step, setStep] = useState(1);
  const [categoria, setCategoria] = useState<string | null>(null);
  const [servico, setServico] = useState<Servico | null>(null);
  const [barbeiro, setBarbeiro] = useState<Barbeiro | null>(null);
  const [qualquerBarbeiro, setQualquerBarbeiro] = useState(true);
  const [data, setData] = useState<string | null>(null);
  const [hora, setHora] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { barbeiros } = useBarbeiros(selectedLocationId);

  const location = localizacoes.find((item) => item.id === selectedLocationId) ?? null;
  const filteredServices = categoria ? servicos.filter((item) => item.categoria === categoria) : servicos;
  const availableDates = useMemo(() => Array.from({ length: 14 }).map((_, index) => {
    const next = new Date();
    next.setDate(next.getDate() + index);
    return next.toISOString().slice(0, 10);
  }), []);
  const slots = ['09:00', '09:30', '10:00', '10:30', '11:00', '14:00', '14:30', '15:00', '16:00', '17:00', '18:00'];

  async function confirm() {
    if (!tenant || !user || !location || !servico || !data || !hora) return;
    setLoading(true);
    const [hour, minute] = hora.split(':').map(Number);
    const start = new Date(`${data}T${hora}:00`);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + servico.duracao_minutos);
    const { data: created, error } = await supabase.from('agendamentos').insert({
      tenant_id: tenant.id,
      utilizador_id: user.id,
      localizacao_id: location.id,
      barbeiro_id: qualquerBarbeiro ? null : barbeiro?.id,
      servico_id: servico.id,
      data,
      hora_inicio: `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
      hora_fim: end.toTimeString().slice(0, 5),
      estado: 'pendente',
      preco_cobrado: servico.preco,
    }).select('id').single();
    setLoading(false);
    if (error) throw error;
    await notifyBookingConfirmed('Agendamento recebido', `${servico.nome} - ${data} ${hora}`);
    await addBookingToCalendar(`${tenant.nome} - ${servico.nome}`, start, end, location.morada);
    setStep(6);
  }

  return (
    <ScrollView contentContainerStyle={{ gap: 14, paddingBottom: 110 }}>
      <View style={{ flexDirection: 'row', gap: 8 }}>{[1, 2, 3, 4, 5].map((item) => <View key={item} style={{ flex: 1, height: 5, borderRadius: 99, backgroundColor: item <= step ? theme.colors.primary : theme.colors.surfaceAlt }} />)}</View>
      {step === 1 && <Step title="Escolher localização">
        {localizacoes.length === 0 ? <Empty text="Ainda não existem localizações configuradas." /> : localizacoes.map((item) => <LocationOption key={item.id} item={item} active={item.id === selectedLocationId} onPress={() => setSelectedLocationId(item.id)} />)}
      </Step>}
      {step === 2 && <Step title="Escolher serviço">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{categories.map((item) => <Chip key={item} active={categoria === item} label={item} onPress={() => setCategoria(categoria === item ? null : item)} />)}</View>
        {filteredServices.length === 0 ? <Empty text="Ainda não existem serviços ativos." /> : filteredServices.map((item) => <ServiceOption key={item.id} item={item} active={item.id === servico?.id} onPress={() => setServico(item)} />)}
      </Step>}
      {step === 3 && <Step title="Escolher barbeiro">
        <Chip label="Qualquer barbeiro disponível" active={qualquerBarbeiro} onPress={() => { setQualquerBarbeiro(true); setBarbeiro(null); }} />
        {barbeiros.map((item) => <BarberOption key={item.id} item={item} active={!qualquerBarbeiro && item.id === barbeiro?.id} onPress={() => { setQualquerBarbeiro(false); setBarbeiro(item); }} />)}
      </Step>}
      {step === 4 && <Step title="Data e hora">
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{availableDates.map((item) => <Chip key={item} active={data === item} label={new Date(item).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })} onPress={() => setData(item)} />)}</View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{slots.map((item) => <Chip key={item} active={hora === item} label={item} onPress={() => setHora(item)} />)}</View>
      </Step>}
      {step === 5 && <Step title="Confirmar">
        <Summary label="Localização" value={location?.nome} />
        <Summary label="Serviço" value={servico ? `${servico.nome} · €${servico.preco} · ${servico.duracao_minutos} min` : undefined} />
        <Summary label="Barbeiro" value={qualquerBarbeiro ? 'Qualquer barbeiro disponível' : barbeiro?.nome} />
        <Summary label="Data" value={data && hora ? `${data} · ${hora}` : undefined} />
      </Step>}
      {step === 6 && <Step title="Agendamento recebido">
        <Text style={{ color: theme.colors.text }}>O pedido ficou registado. A barbearia pode confirmar o agendamento no painel admin.</Text>
      </Step>}
      {step < 6 ? (
        <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'flex-end' }}>
          {step > 1 ? <Button title="Voltar" variant="secondary" onPress={() => setStep(step - 1)} /> : null}
          <Button title={step === 5 ? 'Confirmar' : 'Continuar'} loading={loading} onPress={() => step === 5 ? confirm() : setStep(step + 1)} />
        </View>
      ) : <Button title={t('bookings')} onPress={() => setStep(1)} />}
    </ScrollView>
  );
}

function Step({ title, children }: { title: string; children: React.ReactNode }) {
  const { theme } = useTenant();
  return <Animated.View entering={FadeInUp.duration(220)}><Card><Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '900' }}>{title}</Text>{children}</Card></Animated.View>;
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const { theme } = useTenant();
  return <TouchableOpacity onPress={onPress} style={{ borderRadius: 999, paddingHorizontal: 14, paddingVertical: 10, backgroundColor: active ? theme.colors.primary : theme.colors.surfaceAlt }}><Text style={{ color: active ? '#111214' : theme.colors.text, fontWeight: '900', textTransform: 'capitalize' }}>{label}</Text></TouchableOpacity>;
}

function LocationOption({ item, active, onPress }: { item: Localizacao; active: boolean; onPress: () => void }) {
  const { theme } = useTenant();
  return <TouchableOpacity onPress={onPress} style={{ borderWidth: 1, borderColor: active ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius, padding: 12, gap: 6 }}><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{item.nome}</Text><Text style={{ color: theme.colors.muted }}>{item.morada}</Text></TouchableOpacity>;
}

function ServiceOption({ item, active, onPress }: { item: Servico; active: boolean; onPress: () => void }) {
  const { theme } = useTenant();
  return <TouchableOpacity onPress={onPress} style={{ borderWidth: 1, borderColor: active ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius, padding: 12, flexDirection: 'row', gap: 12 }}>{item.foto_url ? <Image source={{ uri: item.foto_url }} style={{ width: 64, height: 64, borderRadius: 8 }} /> : null}<View style={{ flex: 1 }}><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{item.nome}</Text><Text style={{ color: theme.colors.muted }}>{item.descricao}</Text><Text style={{ color: theme.colors.primary, fontWeight: '900' }}>€{item.preco} · {item.duracao_minutos} min</Text></View></TouchableOpacity>;
}

function BarberOption({ item, active, onPress }: { item: Barbeiro; active: boolean; onPress: () => void }) {
  const { theme } = useTenant();
  return <TouchableOpacity onPress={onPress} style={{ borderWidth: 1, borderColor: active ? theme.colors.primary : theme.colors.border, borderRadius: theme.radius, padding: 12, flexDirection: 'row', gap: 12 }}>{item.foto_url ? <Image source={{ uri: item.foto_url }} style={{ width: 56, height: 56, borderRadius: 28 }} /> : null}<View style={{ flex: 1 }}><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{item.nome}</Text><Text style={{ color: theme.colors.muted }}>{item.especialidades.join(', ')}</Text></View></TouchableOpacity>;
}

function Summary({ label, value }: { label: string; value?: string | null }) {
  const { theme } = useTenant();
  return <View><Text style={{ color: theme.colors.muted }}>{label}</Text><Text style={{ color: theme.colors.text, fontWeight: '900' }}>{value ?? '-'}</Text></View>;
}

function Empty({ text }: { text: string }) {
  const { theme } = useTenant();
  return <Text style={{ color: theme.colors.muted }}>{text}</Text>;
}
