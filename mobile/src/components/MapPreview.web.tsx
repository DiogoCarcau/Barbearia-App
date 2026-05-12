import React from 'react';
import { Text, View } from 'react-native';

type Props = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  style: object;
};

export function MapPreview({ latitude, longitude, title, description, style }: Props) {
  return (
    <View style={[style, { alignItems: 'center', justifyContent: 'center', padding: 18 }]}>
      <Text style={{ color: '#C7A85A', fontWeight: '900', marginBottom: 8 }}>{title}</Text>
      <Text style={{ color: '#FFFFFF', textAlign: 'center' }}>{description}</Text>
      <Text style={{ color: '#B7B7B7', marginTop: 8 }}>{latitude}, {longitude}</Text>
    </View>
  );
}
