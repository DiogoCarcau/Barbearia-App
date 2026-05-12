import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useTenant } from '../../hooks/useTenant';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: keyof typeof Ionicons.glyphMap;
  loading?: boolean;
};

export function Button({ title, onPress, variant = 'primary', icon, loading }: Props) {
  const { theme } = useTenant();
  const backgroundColor = variant === 'primary' ? theme.colors.primary : variant === 'danger' ? theme.colors.danger : theme.colors.surfaceAlt;
  const color = variant === 'primary' ? '#111214' : theme.colors.text;
  return (
    <TouchableOpacity onPress={onPress} disabled={loading} style={{ minHeight: 50, borderRadius: theme.radius, backgroundColor, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 8, paddingHorizontal: 16 }}>
      {loading ? <ActivityIndicator color={color} /> : icon ? <Ionicons name={icon} color={color} size={18} /> : null}
      <Text style={{ color, fontWeight: '900' }}>{title}</Text>
    </TouchableOpacity>
  );
}
