import Mapbox from "@rnmapbox/maps";
import React, {
    createContext,
    useContext,
    useRef,
    useState,
} from "react";

type Coordinate = [number, number];

export type RunexSession = {
  id: string;
  title: string;
  sport_type?: "running" | "cycling" | "walking";
  location_name?: string;
  latitude?: number;
  longitude?: number;
  date?: string;
  time?: string;
  distance_km?: number;
  duration_min?: number;
  pace?: string;
  vibe?: string;
  host_name?: string;
  host_contact?: string;
  max_capacity?: number;
  current_count?: number;
  route?: Coordinate[];
};

type SessionMapContextType = {
  sessions: RunexSession[];
  setSessions: React.Dispatch<React.SetStateAction<RunexSession[]>>;

  selectedSession: RunexSession | null;
  selectSession: (session: RunexSession | null) => void;

  activeRoute: Coordinate[] | null;
  setActiveRoute: React.Dispatch<React.SetStateAction<Coordinate[] | null>>;

  mapCameraRef: React.RefObject<Mapbox.Camera | null>;
  focusOnCoordinate: (longitude: number, latitude: number, zoomLevel?: number) => void;

  addSession: (session: RunexSession) => void;
  clearSelectedSession: () => void;
};

const SessionMapContext = createContext<SessionMapContextType | undefined>(
  undefined
);

export function SessionMapProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sessions, setSessions] = useState<RunexSession[]>([]);
  const [selectedSession, setSelectedSession] =
    useState<RunexSession | null>(null);
  const [activeRoute, setActiveRoute] = useState<Coordinate[] | null>(null);

  const mapCameraRef = useRef<Mapbox.Camera | null>(null);

  function focusOnCoordinate(
    longitude: number,
    latitude: number,
    zoomLevel = 14
  ) {
    mapCameraRef.current?.setCamera({
      centerCoordinate: [longitude, latitude],
      zoomLevel,
      animationDuration: 500,
    });
  }

  function selectSession(session: RunexSession | null) {
    setSelectedSession(session);

    if (session?.longitude && session?.latitude) {
      focusOnCoordinate(session.longitude, session.latitude, 14);
    }

    if (session?.route) {
      setActiveRoute(session.route);
    }
  }

  function clearSelectedSession() {
    setSelectedSession(null);
    setActiveRoute(null);
  }

  function addSession(session: RunexSession) {
    setSessions((currentSessions) => [session, ...currentSessions]);
  }

  return (
    <SessionMapContext.Provider
      value={{
        sessions,
        setSessions,
        selectedSession,
        selectSession,
        activeRoute,
        setActiveRoute,
        mapCameraRef,
        focusOnCoordinate,
        addSession,
        clearSelectedSession,
      }}
    >
      {children}
    </SessionMapContext.Provider>
  );
}

export function useSessionMap() {
  const context = useContext(SessionMapContext);

  if (!context) {
    throw new Error("useSessionMap must be used inside SessionMapProvider");
  }

  return context;
}