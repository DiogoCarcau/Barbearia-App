import { Text, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';
import { Perfil } from '../../lib/types';

export function LevelBadge({ perfil }: { perfil: Perfil | null }) {
  const { theme } = useTenant();
  const level = perfil?.nivel_fidelidade ?? 'bronze';
  return <View style={{ backgroundColor: theme.colors.primary, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 8, alignSelf: 'flex-start' }}><Text style={{ color: '#111214', fontWeight: '900', textTransform: 'capitalize' }}>{level}</Text></View>;
}
