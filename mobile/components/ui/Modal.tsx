import { Modal as RNModal, Text, View } from 'react-native';
import type React from 'react';
import { useTenant } from '../../hooks/useTenant';
import { Button } from './Button';

export function Modal({ visible, title, body, onConfirm, onCancel }: { visible: boolean; title: string; body: string; onConfirm: () => void; onCancel: () => void }) {
  const { theme } = useTenant();
  return (
    <RNModal transparent visible={visible} animationType="fade">
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 }}>
        <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius, padding: 18, gap: 14 }}>
          <Text style={{ color: theme.colors.text, fontSize: 20, fontWeight: '900' }}>{title}</Text>
          <Text style={{ color: theme.colors.muted }}>{body}</Text>
          <Button title="Confirmar" onPress={onConfirm} />
          <Button title="Cancelar" onPress={onCancel} variant="secondary" />
        </View>
      </View>
    </RNModal>
  );
}
