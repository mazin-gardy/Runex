import Mapbox from "@rnmapbox/maps";
import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const GEOAPIFY_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_KEY;

type Amenity = {
  id: string;
  title: string;
  type: string;
  latitude: number;
  longitude: number;
};

type MapAmenitiesProps = {
  visible: boolean;
  latitude: number;
  longitude: number;
};

export default function MapAmenities({
  visible,
  latitude,
  longitude,
}: MapAmenitiesProps) {
  const [amenities, setAmenities] = useState<Amenity[]>([]);

  useEffect(() => {
    if (!visible) return;
    fetchAmenities();
  }, [visible, latitude, longitude]);

  async function fetchAmenities() {
    if (!GEOAPIFY_KEY) {
      console.log("Missing Geoapify key");
      return;
    }

    console.log("Geoapify key loaded:", !!GEOAPIFY_KEY);
    console.log("Fetching amenities near:", latitude, longitude);

    const categories = [
      "amenity.drinking_water",
      "amenity.toilet",
      "commercial.food_and_drink.cafe",
    ].join(",");

    const url =
      `https://api.geoapify.com/v2/places` +
      `?categories=${categories}` +
      `&filter=circle:${longitude},${latitude},3000` +
      `&bias=proximity:${longitude},${latitude}` +
      `&limit=40` +
      `&apiKey=${GEOAPIFY_KEY}`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      console.log("Geoapify raw response:", data);

      const results: Amenity[] =
        data.features?.map((feature: any, index: number) => {
          const categoryList = feature.properties.categories ?? [];
          const type = categoryList.join(",");

          return {
            id: `amenity-${index}`,
            title: feature.properties.name ?? "Amenity",
            type,
            longitude: feature.geometry.coordinates[0],
            latitude: feature.geometry.coordinates[1],
          };
        }) ?? [];

      console.log("Amenities found:", results.length);
      setAmenities(results);
    } catch (error) {
      console.log("Amenity fetch error:", error);
    }
  }

  if (!visible) return null;

  return (
    <>
      {amenities.map((amenity) => (
        <Mapbox.MarkerView
          key={amenity.id}
          id={amenity.id}
          coordinate={[amenity.longitude, amenity.latitude]}
        >
          <View style={styles.marker}>
            <Text style={styles.icon}>{getAmenityIcon(amenity.type)}</Text>
          </View>
        </Mapbox.MarkerView>
      ))}
    </>
  );
}

function getAmenityIcon(type: string) {
  if (type.includes("drinking_water")) return "💧";
  if (type.includes("toilet")) return "🚻";
  if (type.includes("cafe")) return "☕";
  return "📍";
}

const styles = StyleSheet.create({
  marker: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(0,0,0,0.9)",
    borderWidth: 2,
    borderColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },

  icon: {
    fontSize: 18,
  },
});