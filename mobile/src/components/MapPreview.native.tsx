import React from 'react';
import MapView, { Marker } from 'react-native-maps';

type Props = {
  latitude: number;
  longitude: number;
  title: string;
  description: string;
  style: object;
};

export function MapPreview({ latitude, longitude, title, description, style }: Props) {
  const coordinate = { latitude, longitude };
  return (
    <MapView style={style} initialRegion={{ ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 }}>
      <Marker coordinate={coordinate} title={title} description={description} />
    </MapView>
  );
}
