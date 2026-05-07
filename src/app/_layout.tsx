import HomeRouteIcon from "@/components/ui/HomeRoute";
import Ionicons from "@expo/vector-icons/Ionicons";
import Mapbox from "@rnmapbox/maps";
import { Tabs } from "expo-router";

Mapbox.setAccessToken(process.env.EXPO_PUBLIC_MAPBOX_TOKEN!);

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#010101",
          borderTopColor: "#222222",
          height: 70,
          paddingBottom: 10,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#fcfafa",
        tabBarInactiveTintColor: "#777777",
      }}
    >
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <HomeRouteIcon
              color={focused ? "#ffffff" : "#777777"}
              size={32}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="Fitnect"
        options={{
          title: "Fitnect",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="triangle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}