import { View } from 'react-native';
import type React from 'react';
import { useTenant } from '../../hooks/useTenant';

export function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  const { theme } = useTenant();
  return <View style={[{ backgroundColor: theme.colors.surface, borderColor: theme.colors.border, borderWidth: 1, borderRadius: theme.radius, padding: 16, gap: 12 }, style]}>{children}</View>;
}
