import { Text, View } from 'react-native';
import { Card } from '../ui/Card';
import { useTenant } from '../../hooks/useTenant';

export function StatsCard() {
  const { perfil, theme } = useTenant();
  return (
    <Card>
      <Text style={{ color: theme.colors.text, fontSize: 18, fontWeight: '900' }}>Estatísticas</Text>
      <View style={{ gap: 8 }}>
        <Text style={{ color: theme.colors.text }}>{perfil?.total_visitas ?? 0} cortes realizados</Text>
        <Text style={{ color: theme.colors.text }}>Membro desde {perfil?.criado_em ? new Date(perfil.criado_em).toLocaleDateString() : '-'}</Text>
        <Text style={{ color: theme.colors.text }}>Total gasto: €{Number(perfil?.total_gasto ?? 0).toFixed(2)}</Text>
      </View>
    </Card>
  );
}
