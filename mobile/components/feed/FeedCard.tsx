import { Image, Text, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';
import { FotoFeed } from '../../lib/types';

export function FeedCard({ item }: { item: FotoFeed }) {
  const { theme } = useTenant();
  return (
    <View style={{ flex: 1, minWidth: '31%', borderRadius: theme.radius, overflow: 'hidden', backgroundColor: theme.colors.surface }}>
      <Image source={{ uri: item.url }} style={{ width: '100%', aspectRatio: 1 }} />
      {item.legenda ? <Text numberOfLines={2} style={{ color: theme.colors.text, padding: 8, fontSize: 12 }}>{item.legenda}</Text> : null}
    </View>
  );
}
