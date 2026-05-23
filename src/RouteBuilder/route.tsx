import Mapbox from "@rnmapbox/maps";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
const MAPBOX_TOKEN = process.env.EXPO_PUBLIC_MAPBOX_TOKEN as string;

if (MAPBOX_TOKEN) {
  Mapbox.setAccessToken(MAPBOX_TOKEN);
}

type Coordinate = [number, number];
type SportType = "running" | "cycling" | "walking";

type RouteBuilderProps = {
  isBuilding: boolean;
  sessions?: any[];
  onExitBuilder?: () => void;
  onSessionSelected?: (session: any) => void;
  onRouteSaved?: (
    distanceKm: number,
    durationMin: number,
    startPoint: Coordinate,
    endPoint: Coordinate,
    routeCoordinates: Coordinate[]
  ) => void;
};

const MELBOURNE: Coordinate = [144.9631, -37.8136];

const SPORT_PROFILES: Record<SportType, string> = {
  running: "walking",
  walking: "walking",
  cycling: "cycling",
};

const SPORT_COLORS: Record<SportType, string> = {
  running: "#4ade80",
  cycling: "#60a5fa",
  walking: "#f0a830",
};

const SPORTS: { label: string; value: SportType }[] = [
  { label: "🏃 Run", value: "running" },
  { label: "🚴 Cycle", value: "cycling" },
  { label: "🚶 Walk", value: "walking" },
];

const VIBE_COLORS: Record<string, string> = {
  Social: "#534AB7",
  Tempo: "#BA7517",
  Beginner: "#1D9E75",
  Intervals: "#D4537E",
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function RouteBuilder({
  isBuilding,
  sessions = [],
  onExitBuilder,
  onSessionSelected,
  onRouteSaved,
}: RouteBuilderProps) {
  const cameraRef = useRef<Mapbox.Camera>(null);
  const animationIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const [points, setPoints] = useState<Coordinate[]>([]);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [sportType, setSportType] = useState<SportType>("running");

  const [animatedRouteCoords, setAnimatedRouteCoords] = useState<Coordinate[]>(
    []
  );

  const [distance, setDistance] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isBuilding) {
      clearRoute();
      clearAnimatedSessionRoute();
    }
  }, [isBuilding]);

  useEffect(() => {
    return () => {
      if (animationIntervalRef.current) {
        clearInterval(animationIntervalRef.current);
      }
    };
  }, []);

  function handleMapPress(event: any) {
    if (!isBuilding) return;

    const coordinate = event.geometry.coordinates as Coordinate;
    const newPoints = [...points, coordinate];

    setPoints(newPoints);

    if (newPoints.length >= 2) {
      fetchRoute(newPoints, sportType);
    }
  }

  async function fetchRoute(waypoints: Coordinate[], sport: SportType) {
    if (!MAPBOX_TOKEN) {
      Alert.alert("Mapbox token missing", "Check EXPO_PUBLIC_MAPBOX_TOKEN.");
      return;
    }

    setIsCalculating(true);

    const profile = SPORT_PROFILES[sport];

    const coordinateString = waypoints
      .map((point) => `${point[0]},${point[1]}`)
      .join(";");

    const url =
      `https://api.mapbox.com/directions/v5/mapbox/${profile}/${coordinateString}` +
      `?geometries=geojson&overview=full&steps=false&access_token=${MAPBOX_TOKEN}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      const route = data.routes?.[0];

      if (!response.ok || !route) {
        console.log("Mapbox route failed:", data);
        useStraightLineFallback(waypoints);
        return;
      }

      const routeCoordinates = route.geometry.coordinates as Coordinate[];
      const distanceKm = Number((route.distance / 1000).toFixed(2));
      const durationMin = Math.round(route.duration / 60);

      setRouteCoords(routeCoordinates);
      setDistance(distanceKm);
      setDuration(durationMin);
    } catch (error) {
      console.log("Route error:", error);
      useStraightLineFallback(waypoints);
    } finally {
      setIsCalculating(false);
    }
  }

  function useStraightLineFallback(waypoints: Coordinate[]) {
    const fallbackDistance = calculateStraightLineDistance(waypoints);
    const fallbackDuration = Math.round(fallbackDistance * 6);

    setRouteCoords(waypoints);
    setDistance(Number(fallbackDistance.toFixed(2)));
    setDuration(fallbackDuration);
  }

  function handleSportChange(sport: SportType) {
    setSportType(sport);

    if (points.length >= 2) {
      fetchRoute(points, sport);
    }
  }

  function handleUndo() {
    if (points.length === 0) return;

    const updatedPoints = points.slice(0, -1);

    setPoints(updatedPoints);

    if (updatedPoints.length >= 2) {
      fetchRoute(updatedPoints, sportType);
    } else {
      setRouteCoords([]);
      setDistance(0);
      setDuration(0);
    }
  }

  function clearRoute() {
    setPoints([]);
    setRouteCoords([]);
    setDistance(0);
    setDuration(0);
  }

  function handleCancel() {
    clearRoute();
    clearAnimatedSessionRoute();
    onExitBuilder?.();
  }

  function handleSaveRoute() {
    if (points.length < 2 || distance <= 0) {
      Alert.alert("Route not ready", "Add at least two points first.");
      return;
    }

    const startPoint = points[0];
    const endPoint = points[points.length - 1];

    onRouteSaved?.(distance, duration, startPoint, endPoint, routeCoords);
  }

  function clearAnimatedSessionRoute() {
    if (animationIntervalRef.current) {
      clearInterval(animationIntervalRef.current);
      animationIntervalRef.current = null;
    }

    setAnimatedRouteCoords([]);
  }

  function animateSessionRoute(route: Coordinate[]) {
    if (!route || route.length < 2) return;

    clearAnimatedSessionRoute();

    let index = 0;

    animationIntervalRef.current = setInterval(() => {
      index += 4;

      const nextRoute = route.slice(0, index);
      setAnimatedRouteCoords(nextRoute);

      if (index >= route.length) {
        if (animationIntervalRef.current) {
          clearInterval(animationIntervalRef.current);
          animationIntervalRef.current = null;
        }

        setAnimatedRouteCoords(route);
      }
    }, 35);
  }

  function handleSessionPinPress(session: any) {
    const longitude = session.longitude;
    const latitude = session.latitude;

    if (longitude && latitude) {
      cameraRef.current?.setCamera({
        centerCoordinate: [longitude, latitude],
        zoomLevel: 14,
        animationDuration: 1200,
      });
    }

    if (session.route && Array.isArray(session.route)) {
      animateSessionRoute(session.route);
    }

    setTimeout(() => {
      onSessionSelected?.(session);
    }, 450);
  }

  const routeShape: any = useMemo(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: routeCoords,
      },
      properties: {},
    }),
    [routeCoords]
  );

  const animatedSessionRouteShape: any = useMemo(
    () => ({
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: animatedRouteCoords,
      },
      properties: {},
    }),
    [animatedRouteCoords]
  );

  return (
    <View style={styles.container}>
      <Mapbox.MapView
        style={styles.map}
        styleURL="mapbox://styles/mapbox/dark-v11"
        onPress={handleMapPress}
        logoEnabled={false}
        compassEnabled={false}
        scaleBarEnabled={false}
      >
        <Mapbox.Camera
          ref={cameraRef}
          zoomLevel={13}
          centerCoordinate={MELBOURNE}
        />
        

        {!isBuilding &&
          sessions.map((session) => (
            <Mapbox.MarkerView
              key={session.id}
              id={`session-${session.id}`}
              coordinate={[
                session.longitude ?? MELBOURNE[0],
                session.latitude ?? MELBOURNE[1],
              ]}
            >
              <TouchableOpacity
                style={styles.sessionPin}
                onPress={() => handleSessionPinPress(session)}
              >
                <View
                  style={[
                    styles.sessionPinCircle,
                    {
                      borderColor:
                        VIBE_COLORS[session.vibe] ?? SPORT_COLORS.running,
                    },
                  ]}
                >
                  <Text style={styles.sessionPinText}>
                    {session.host_name
                      ? getInitials(session.host_name)
                      : session.host
                      ? getInitials(session.host)
                      : "RN"}
                  </Text>
                </View>
              </TouchableOpacity>
            </Mapbox.MarkerView>
          ))}

        {!isBuilding && animatedRouteCoords.length > 1 && (
          <Mapbox.ShapeSource
            id="animatedSessionRouteSource"
            shape={animatedSessionRouteShape}
          >
            <Mapbox.LineLayer
              id="animatedSessionRouteLine"
              style={{
                lineColor: "#00AEEF",
                lineWidth: 7,
                lineCap: "round",
                lineJoin: "round",
                lineOpacity: 0.95,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {isBuilding && routeCoords.length > 1 && (
          <Mapbox.ShapeSource id="routeSource" shape={routeShape}>
            <Mapbox.LineLayer
              id="routeLine"
              style={{
                lineColor: SPORT_COLORS[sportType],
                lineWidth: 6,
                lineCap: "round",
                lineJoin: "round",
                lineOpacity: 1,
              }}
            />
          </Mapbox.ShapeSource>
        )}

        {isBuilding &&
          points.map((point, index) => (
            <Mapbox.MarkerView
              key={`point-${index}`}
              id={`point-${index}`}
              coordinate={point}
            >
              <View
                style={[
                  styles.point,
                  index === 0 && styles.pointStart,
                  index === points.length - 1 && index > 0 && styles.pointEnd,
                ]}
              >
                <Text style={styles.pointText}>{index + 1}</Text>
              </View>
            </Mapbox.MarkerView>
          ))}
      </Mapbox.MapView>

      {isBuilding && (
        <>
          <View style={styles.sportSelector}>
            {SPORTS.map((sport) => {
              const active = sportType === sport.value;

              return (
                <TouchableOpacity
                  key={sport.value}
                  style={[
                    styles.sportPill,
                    active && {
                      backgroundColor: SPORT_COLORS[sport.value],
                      borderColor: SPORT_COLORS[sport.value],
                    },
                  ]}
                  onPress={() => handleSportChange(sport.value)}
                >
                  <Text
                    style={[
                      styles.sportPillText,
                      active && styles.sportPillTextActive,
                    ]}
                  >
                    {sport.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.distancePill}>
            {isCalculating ? (
              <Text style={styles.distanceText}>Calculating...</Text>
            ) : distance > 0 ? (
              <>
                <Text
                  style={[
                    styles.distanceText,
                    { color: SPORT_COLORS[sportType] },
                  ]}
                >
                  {distance} km
                </Text>

                <Text style={styles.durationText}>~{duration} min</Text>
              </>
            ) : (
              <Text style={styles.distanceText}>Tap map to start</Text>
            )}
          </View>

          <View style={styles.hint}>
            <Text style={styles.hintText}>
              {points.length === 0
                ? "📍 Tap map to add start point"
                : points.length === 1
                ? "🏁 Tap map to add end point"
                : `${points.length} points · tap to add more`}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.cancelRouteButton}
            onPress={handleCancel}
          >
            <Text style={styles.cancelRouteButtonText}>✕ Cancel Route</Text>
          </TouchableOpacity>

          <View style={styles.actionPanel}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                points.length === 0 && styles.disabledButton,
              ]}
              disabled={points.length === 0}
              onPress={handleUndo}
            >
              <Text style={styles.actionButtonText}>Undo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.actionButton,
                points.length === 0 && styles.disabledButton,
              ]}
              disabled={points.length === 0}
              onPress={clearRoute}
            >
              <Text style={styles.actionButtonText}>Clear</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.saveButton,
                points.length < 2 && styles.saveButtonDisabled,
              ]}
              disabled={points.length < 2}
              onPress={handleSaveRoute}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </View>
  );
}

function calculateStraightLineDistance(points: Coordinate[]) {
  if (points.length < 2) return 0;

  let total = 0;

  for (let i = 0; i < points.length - 1; i++) {
    total += distanceBetween(points[i], points[i + 1]);
  }

  return total;
}

function distanceBetween(pointA: Coordinate, pointB: Coordinate) {
  const [lon1, lat1] = pointA;
  const [lon2, lat2] = pointB;

  const earthRadiusKm = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map: {
    flex: 1,
  },

  sessionPin: {
    alignItems: "center",
    justifyContent: "center",
  },

  sessionPinCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#1c1c1e",
    borderWidth: 3,
    alignItems: "center",
    justifyContent: "center",
  },

  sessionPinText: {
    color: "#ffffff",
    fontSize: 13,
    fontWeight: "900",
  },

  point: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#ffffff",
    borderWidth: 4,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },

  pointStart: {
    backgroundColor: "#4ade80",
  },

  pointEnd: {
    backgroundColor: "#eab308",
  },

  pointText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 12,
  },

  sportSelector: {
    position: "absolute",
    top: 58,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    zIndex: 30,
  },

  sportPill: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 24,
    backgroundColor: "rgba(0,0,0,0.82)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    alignItems: "center",
  },

  sportPillText: {
    color: "rgba(255,255,255,0.65)",
    fontSize: 14,
    fontWeight: "800",
  },

  sportPillTextActive: {
    color: "#000000",
  },

  distancePill: {
    position: "absolute",
    top: 122,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "rgba(0,0,0,0.86)",
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    zIndex: 30,
  },

  distanceText: {
    color: "#ffffff",
    fontSize: 17,
    fontWeight: "900",
  },

  durationText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 15,
    fontWeight: "700",
  },

  hint: {
    position: "absolute",
    bottom: 210,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.78)",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    zIndex: 30,
  },

  hintText: {
    color: "rgba(255,255,255,0.72)",
    fontSize: 14,
    fontWeight: "700",
  },

  cancelRouteButton: {
    position: "absolute",
    bottom: 152,
    alignSelf: "center",
    backgroundColor: "rgba(0,0,0,0.86)",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 26,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    zIndex: 30,
  },

  cancelRouteButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },

  actionPanel: {
    position: "absolute",
    bottom: 88,
    left: 22,
    right: 22,
    flexDirection: "row",
    gap: 10,
    zIndex: 30,
  },

  actionButton: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.86)",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  actionButtonText: {
    color: "#ffffff",
    fontWeight: "900",
    fontSize: 15,
  },

  disabledButton: {
    opacity: 0.4,
  },

  saveButton: {
    flex: 1.2,
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    borderRadius: 24,
    alignItems: "center",
  },

  saveButtonDisabled: {
    backgroundColor: "#333333",
  },

  saveButtonText: {
    color: "#000000",
    fontWeight: "900",
    fontSize: 15,
  },
});