import Mapbox from '@rnmapbox/maps';
import React from 'react';
import { StyleSheet, View } from 'react-native';


export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Mapbox.MapView style={styles.map}
       >
        <Mapbox.Camera
          zoomLevel={13}
          centerCoordinate={[144.9631, -37.8136]}
          
        />
      </Mapbox.MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
});