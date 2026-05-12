import { useMemo, useState } from 'react';
import { Alert, ScrollView, Text, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { useAgendamentos } from '../../hooks/useAgendamentos';
import { useTenant } from '../../hooks/useTenant';

export default function AgendamentosScreen() {
  const { t } = useTranslation();
  const { theme } = useTenant();
  const { agendamentos, cancel } = useAgendamentos();
  const [tab, setTab] = useState<'proximos' | 'historico'>('proximos');
  const today = new Date().toISOString().slice(0, 10);
  const items = useMemo(() => agendamentos.filter((item) => tab === 'proximos' ? item.data >= today && item.estado !== 'cancelado' : item.data < today || item.estado === 'cancelado'), [agendamentos, tab]);
  return (
    <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 14, paddingBottom: 100 }}>
      <Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900' }}>{t('bookings')}</Text>
      <View style={{ flexDirection: 'row', gap: 8 }}><Button title={t('upcoming')} variant={tab === 'proximos' ? 'primary' : 'secondary'} onPress={() => setTab('proximos')} /><Button title={t('history')} variant={tab === 'historico' ? 'primary' : 'secondary'} onPress={() => setTab('historico')} /></View>
      {items.length === 0 ? <Text style={{ color: theme.colors.muted }}>Sem agendamentos para mostrar.</Text> : items.map((item) => (
        <Card key={item.id}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}><Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>{item.servicos?.nome}</Text><Badge label={item.estado} /></View>
          <Text style={{ color: theme.colors.muted }}>{item.data} · {item.hora_inicio.slice(0, 5)} · {item.barbeiros?.nome ?? 'Qualquer barbeiro'}</Text>
          <Text style={{ color: theme.colors.muted }}>{item.localizacoes?.nome}</Text>
          {tab === 'proximos' ? <Button title={t('cancel')} variant="danger" onPress={() => Alert.alert('Cancelar', 'Queres cancelar este agendamento?', [{ text: 'Não' }, { text: 'Sim', onPress: () => cancel(item.id) }])} /> : <Button title={t('repeat')} variant="secondary" onPress={() => Alert.alert('Repetir', 'Abre o fluxo de agendamento com estes dados pré-selecionados.')} />}
        </Card>
      ))}
    </ScrollView>
  );
}
