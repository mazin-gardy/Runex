import ButtonRoute from "@/components/ui/ButtonRoute";
import { SessionMapProvider } from "@/RouteBuilder/appearOnMap/appearOnMap";
import RouteBuilder from "@/RouteBuilder/route";
import SessionCard from "@/SessionCard/card";
import CreateSession from "@/SessionCard/creatingSession";

import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import React, { useCallback, useMemo, useRef, useState } from "react";
import { StyleSheet } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { View, YStack } from "tamagui";

type Coordinate = [number, number];

export default function Index() {
  return (
    <SessionMapProvider>
      <IndexContent />
    </SessionMapProvider>
  );
}

function IndexContent() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);

  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);
  const [routeStartPoint, setRouteStartPoint] = useState<Coordinate | null>(
    null
  );
  const [routeEndPoint, setRouteEndPoint] = useState<Coordinate | null>(null);
  const [routeCoordinates, setRouteCoordinates] = useState<Coordinate[]>([]);

  const [sessions, setSessions] = useState<any[]>([]);

  const sessionSheetRef = useRef<BottomSheet>(null);
  const createSheetRef = useRef<BottomSheet>(null);

  const sessionSnapPoints = useMemo(() => ["50%"], []);
  const createSnapPoints = useMemo(() => ["62%"], []);

  const openSessionCard = useCallback((session: any) => {
    setSelectedSession(session);

    requestAnimationFrame(() => {
      sessionSheetRef.current?.expand();
    });
  }, []);

  function startRouteBuilder() {
    setSelectedSession(null);
    setShowCreate(false);
    setRouteDistance(null);
    setRouteDuration(null);
    setRouteStartPoint(null);
    setRouteEndPoint(null);
    setRouteCoordinates([]);
    setIsBuilding(true);
  }

  function exitRouteBuilder() {
    setIsBuilding(false);
    setRouteDistance(null);
    setRouteDuration(null);
    setRouteStartPoint(null);
    setRouteEndPoint(null);
    setRouteCoordinates([]);
  }

  function handleRouteSaved(
    distance: number,
    duration: number,
    startPoint: Coordinate,
    endPoint: Coordinate,
    routeCoords?: Coordinate[]
  ) {
    setRouteDistance(distance);
    setRouteDuration(duration);
    setRouteStartPoint(startPoint);
    setRouteEndPoint(endPoint);
    setRouteCoordinates(routeCoords ?? []);

    setIsBuilding(false);
    setShowCreate(true);

    requestAnimationFrame(() => {
      createSheetRef.current?.expand();
    });
  }

  function closeCreateSheet() {
    createSheetRef.current?.close();
    setShowCreate(false);
  }

  function handleSessionCreated(session: any) {
    const newSession = {
      ...session,
      id: session.id ?? Date.now().toString(),

      distance: routeDistance,
      duration: routeDuration,

      distance_km: routeDistance,
      duration_min: routeDuration,

      latitude: session.latitude ?? routeStartPoint?.[1],
      longitude: session.longitude ?? routeStartPoint?.[0],

      endLatitude: routeEndPoint?.[1],
      endLongitude: routeEndPoint?.[0],

      route: routeCoordinates,
    };

    setSessions((prev) => [newSession, ...prev]);

    setShowCreate(false);
    setRouteDistance(null);
    setRouteDuration(null);
    setRouteStartPoint(null);
    setRouteEndPoint(null);
    setRouteCoordinates([]);

    createSheetRef.current?.close();
  }

  function closeSessionCard() {
    sessionSheetRef.current?.close();
    setSelectedSession(null);
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <View flex={1} backgroundColor="#000">
        <RouteBuilder
          isBuilding={isBuilding}
          sessions={sessions}
          onExitBuilder={exitRouteBuilder}
          onSessionSelected={openSessionCard}
          onRouteSaved={handleRouteSaved}
        />

        {!isBuilding && !showCreate && !selectedSession && (
          <YStack
            position="absolute"
            bottom={60}
            alignSelf="center"
            zIndex={20}
            elevation={20}
          >
            <ButtonRoute onPress={startRouteBuilder} />
          </YStack>
        )}

        <BottomSheet
          ref={sessionSheetRef}
          index={-1}
          snapPoints={sessionSnapPoints}
          enablePanDownToClose
          onClose={() => setSelectedSession(null)}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetView style={styles.sheetContent}>
            {selectedSession && (
              <SessionCard
                session={selectedSession}
                onClose={closeSessionCard}
                onJoin={(id: string) => console.log("Join:", id)}
              />
            )}
          </BottomSheetView>
        </BottomSheet>

        <BottomSheet
          ref={createSheetRef}
          index={-1}
          snapPoints={createSnapPoints}
          enablePanDownToClose
          onClose={() => setShowCreate(false)}
          backgroundStyle={styles.sheetBackground}
          handleIndicatorStyle={styles.sheetHandle}
        >
          <BottomSheetView style={styles.sheetContent}>
            {showCreate && (
              <CreateSession
                onClose={closeCreateSheet}
                onCreated={handleSessionCreated}
                routeDistance={routeDistance}
                routeDuration={routeDuration}
              />
            )}
          </BottomSheetView>
        </BottomSheet>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },

  sheetBackground: {
    backgroundColor: "#1c1c1e",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  sheetHandle: {
    backgroundColor: "rgba(255,255,255,0.25)",
    width: 44,
  },

  sheetContent: {
    flex: 1,
    padding: 16,
  },
});