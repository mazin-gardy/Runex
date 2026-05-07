import Mapbox from '@rnmapbox/maps';
import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN as string;

type Coordinate = [number, number];

type RouteBuilderProps = {
  isBuilding: boolean;
  onRouteSaved?: (distanceKm: number, durationMin: number) => void;
  onSessionSelected?: (session: any) => void;
};

const MOCK_SESSIONS = [
  {
    id: '1',
    title: 'Tan Track Tuesday',
    host: 'Maya C.',
    date: 'Tue 11 Mar',
    time: '6:30 AM',
    distance: 5.2,
    duration: 32,
    pace: 'Easy',
    location: 'Kings Domain',
    vibe: 'Social',
    current_count: 8,
    max_capacity: 12,
    is_locked: false,
    latitude: -37.8302,
    longitude: 144.9670,
  },
  {
    id: '2',
    title: 'Yarra Trail Blast',
    host: 'Jake R.',
    date: 'Sat 15 Mar',
    time: '7:00 AM',
    distance: 10,
    duration: 60,
    pace: 'Moderate',
    location: 'Yarra Bend Park',
    vibe: 'Tempo',
    current_count: 8,
    max_capacity: 8,
    is_locked: true,
    latitude: -37.7877,
    longitude: 145.0100,
  },
  {
    id: '3',
    title: 'Beginners Welcome',
    host: 'Priya N.',
    date: 'Sun 16 Mar',
    time: '8:00 AM',
    distance: 3,
    duration: 20,
    pace: 'Easy',
    location: 'Flagstaff Gardens',
    vibe: 'Beginner',
    current_count: 4,
    max_capacity: 20,
    is_locked: false,
    latitude: -37.8099,
    longitude: 144.9560,
  },
];

export default function RouteBuilder({
  isBuilding,
  onRouteSaved,
  onSessionSelected,
}: RouteBuilderProps) {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);

  const handleMapPress = (event: any) => {
    if (!isBuilding) return;
    const coordinate = event.geometry.coordinates as Coordinate;
    const newPoints = [...points, coordinate];
    setPoints(newPoints);
    if (newPoints.length >= 2) calculateRoute(newPoints);
  };

  const calculateRoute = async (waypoints: Coordinate[]) => {
    const coordinates = waypoints.map(p => `${p[0]},${p[1]}`).join(';');
    const url = `https://api.mapbox.com/directions/v5/mapbox/walking/${coordinates}?geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const route = data.routes?.[0];
      if (!route) return;
      setRouteCoords(route.geometry.coordinates);
      onRouteSaved?.(
        parseFloat((route.distance / 1000).toFixed(2)),
        Math.round(route.duration / 60)
      );
    } catch (error) {
      console.error('Route error:', error);
    }
  };

  const routeShape = {
    type: 'Feature' as const,
    geometry: {
      type: 'LineString' as const,
      coordinates: routeCoords,
    },
    properties: {},
  };

  return (
    <Mapbox.MapView
      style={styles.map}
      styleURL="mapbox://styles/mapbox/dark-v11"
      onPress={handleMapPress}
      logoEnabled={false}
      compassEnabled={false}
      scaleBarEnabled={false}
    >
      <Mapbox.Camera
        zoomLevel={13}
        centerCoordinate={[144.9631, -37.8136]}
      />

      {/* Session pins */}
      {!isBuilding && MOCK_SESSIONS.map(session => (
        <Mapbox.PointAnnotation
          key={session.id}
          id={session.id}
          coordinate={[session.longitude, session.latitude]}
          onSelected={() => onSessionSelected?.(session)}
        >
          <View style={styles.pin}>
            <Text style={styles.pinText}>🏃</Text>
          </View>
        </Mapbox.PointAnnotation>
      ))}

      {/* Route waypoints */}
      {points.map((point, index) => (
        <Mapbox.PointAnnotation
          key={`point-${index}`}
          id={`point-${index}`}
          coordinate={point}
        >
          <View style={[
            styles.point,
            index === 0 && styles.pointStart,
            index === points.length - 1 && index > 0 && styles.pointEnd,
          ]}>
            <Text style={styles.pointText}>{index + 1}</Text>
          </View>
        </Mapbox.PointAnnotation>
      ))}

      {/* Route line */}
      {routeCoords.length > 1 && (
        <Mapbox.ShapeSource id="routeSource" shape={routeShape}>
          <Mapbox.LineLayer
            id="routeLine"
            style={{
              lineColor: '#ffffff',
              lineWidth: 5,
              lineCap: 'round',
              lineJoin: 'round',
            }}
          />
        </Mapbox.ShapeSource>
      )}
    </Mapbox.MapView>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
  pin: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderWidth: 2,
    borderColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pinText: {
    fontSize: 18,
  },
  point: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 3,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pointStart: {
    backgroundColor: '#4ade80',
  },
  pointEnd: {
    backgroundColor: '#eab308',
  },
  pointText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 11,
  },
});