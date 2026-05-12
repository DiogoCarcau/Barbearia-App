import { Image, Text, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';

export function Avatar({ uri, name, size = 48 }: { uri?: string | null; name?: string | null; size?: number }) {
  const { theme } = useTenant();
  if (uri) return <Image source={{ uri }} style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.surfaceAlt }} />;
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ color: '#111214', fontWeight: '900' }}>{name?.slice(0, 1).toUpperCase() ?? '?'}</Text>
    </View>
  );
}
