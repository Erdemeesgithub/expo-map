import * as Location from "expo-location";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect, useRef } from "react";

export default function App() {
  const [location, setLocation] = useState(null);
  const mapRef = useRef();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);
  console.log({ location });

  return (
    <View>
      <MapView
        ref={mapRef}
        mapType="hybrid"
        showsTraffic
        provider="google"
        style={{ width: "100%", height: "100%" }}
      >
        {location && (
          <Marker
            coordinate={{
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            }}
          >
            <View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "pink",
              }}
            >
              <Text>M</Text>
            </View>
          </Marker>
        )}
      </MapView>
      <View
        style={{
          position: "absolute",
          bottom: 20,
          right: 20,
          backgroundColor: "white",
        }}
      >
        <Button
          title="center"
          onPress={() => {
            mapRef.current.animateToRegion;
          }}
        ></Button>
      </View>
    </View>
  );
}
