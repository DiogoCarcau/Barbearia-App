import { Text, TextInput, TextInputProps, View } from 'react-native';
import { useTenant } from '../../hooks/useTenant';

type Props = TextInputProps & { label?: string };

export function Input({ label, style, ...props }: Props) {
  const { theme } = useTenant();
  return (
    <View style={{ gap: 8 }}>
      {label ? <Text style={{ color: theme.colors.muted, fontWeight: '800' }}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={theme.colors.muted}
        style={[{ minHeight: 50, borderRadius: theme.radius, borderWidth: 1, borderColor: theme.colors.border, backgroundColor: theme.colors.surface, color: theme.colors.text, paddingHorizontal: 14 }, style]}
        {...props}
      />
    </View>
  );
}
