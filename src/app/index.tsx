import ButtonRoute from '@/components/ui/ButtonRoute';
import RouteBuilder from '@/RouteBuilder/route';
import SessionCard from '@/SessionCard/card';
import CreateSession from '@/SessionCard/creatingSession';
import React, { useState } from 'react';
import { Modal, StyleSheet, View } from 'react-native';




export default function Index() {
  const [isBuilding, setIsBuilding] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [routeDistance, setRouteDistance] = useState<number | null>(null);
  const [routeDuration, setRouteDuration] = useState<number | null>(null);

  return (
    <View style={styles.container}>

      <RouteBuilder
        isBuilding={isBuilding}
        onSessionSelected={(session) => setSelectedSession(session)}
        onRouteSaved={(distance, duration) => {
          setRouteDistance(distance);
          setRouteDuration(duration);
          setShowCreate(true);
        }}
      />

      {/* Session card */}
      {selectedSession && !isBuilding && (
        <View style={styles.cardWrapper}>
          <SessionCard
            session={{
              ...selectedSession,
              distance: routeDistance ?? selectedSession.distance,
              duration: routeDuration ?? selectedSession.duration,
            }}
            onClose={() => setSelectedSession(null)}
            onJoin={(id) => console.log('Join request:', id)}
          />
        </View>
      )}

      {/* Create session button */}
      {!isBuilding && (
        <View style={styles.buttonWrapper}>
          <ButtonRoute onPress={() => setIsBuilding(true)} />
        </View>
      )}

      {/* Create session modal */}
      <Modal
        visible={showCreate}
        animationType="slide"
        presentationStyle="fullScreen"
      >
        <CreateSession
          onClose={() => setShowCreate(false)}
          onCreated={(session) => {
            console.log('Session created:', session);
            setShowCreate(false);
          }}
          routeDistance={routeDistance}
          routeDuration={routeDuration}
        />
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardWrapper: {
    position: 'absolute',
    bottom: 100,
    left: 16,
    right: 16,
    zIndex: 10,
  },
  buttonWrapper: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
  },
});