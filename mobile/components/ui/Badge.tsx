import { Text, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';

export function Badge({ label, tone = 'default' }: { label: string; tone?: 'default' | 'success' | 'danger' }) {
  const { theme } = useTenant();
  const color = tone === 'success' ? theme.colors.success : tone === 'danger' ? theme.colors.danger : theme.colors.primary;
  return <View style={{ alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: color }}><Text style={{ color: '#111214', fontWeight: '900', fontSize: 12 }}>{label}</Text></View>;
}
