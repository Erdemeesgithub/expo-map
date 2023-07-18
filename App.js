import { configureAbly, useChannel } from "@ably-labs/react-hooks";
import * as Location from "expo-location";
import { StyleSheet, Text, View, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { useState, useEffect, useRef } from "react";

configureAbly({
  key: "bkfaTw.m4eClg:QbKhJEPJ4rz4yv4vVMLjDgwzh0RFAqdnHXP2yYoaRHQ",
  clientId: Date.now() + "",
});

export default function App() {
  const [location, setLocation] = useState(null);

  const mapRef = useRef();

  const [channel] = useChannel("gps-tracking", (message) => {
    console.log({ message });
  });

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      Location.watchPositionAsync({}, (location) => {
        setLocation(location);
        mapRef.current.animateToRegion(
          {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          },
          500
        );
        channel.publish("message", location);
      });
    })();
  }, []);
  // console.log({ location });

  return (
    <View>
      <MapView
        ref={mapRef}
        mapType="hybrid"
        showsTraffic
        showsCompass
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
              <Text>Me</Text>
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
            mapRef.current.animateToRegion(
              {
                latitude: 47.9108828,
                longitude: 106.8191448,
                latitudeDelta: 1,
                longitudeDelta: 1,
              },
              500
            );
          }}
        ></Button>
      </View>
    </View>
  );
}
