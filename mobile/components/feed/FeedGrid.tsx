import { Text, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';
import { FeedCard } from './FeedCard';

export function FeedGrid() {
  const { feed, theme } = useTenant();
  if (!feed.length) return <Text style={{ color: theme.colors.muted }}>O feed ainda não tem fotos publicadas.</Text>;
  return <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>{feed.map((item) => <FeedCard key={item.id} item={item} />)}</View>;
}
