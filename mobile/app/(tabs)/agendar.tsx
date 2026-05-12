import { ScrollView, Text } from 'react-native';
import { BookingSteps } from '../../components/booking/BookingSteps';
import { useTenant } from '../../hooks/useTenant';

export default function AgendarScreen() {
  const { theme } = useTenant();
  return <ScrollView style={{ backgroundColor: theme.colors.background }} contentContainerStyle={{ padding: 18, gap: 14 }}><Text style={{ color: theme.colors.text, fontSize: 28, fontWeight: '900' }}>Agendar</Text><BookingSteps /></ScrollView>;
}
