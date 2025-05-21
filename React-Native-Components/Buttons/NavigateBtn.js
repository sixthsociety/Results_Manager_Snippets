import React from "react";
import { View, Linking, Alert, Image, Pressable } from "react-native";
import { ButtonIconStyles as styles } from "./styles.js";

const NavigateBtn = ({ address }) => {
  const handleDirectionsPressed = (address) => {
    // Add address to Google maps URL
    const mapsURL = `https://www.google.com/maps/dir/?api=1&origin=my+location&destination=${encodeURIComponent(
      address
    )}`;

    Linking.canOpenURL(mapsURL)
      .then((supported) => {
        if (supported) {
          Linking.openURL(mapsURL); // Open google maps with the URL made using the job address
        } else {
          Alert.alert(`Don't know how to open this URL: ${mapsURL}`);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={styles.container}
        onPress={() => {
          handleDirectionsPressed(address);
        }}
      >
        <Image
          source={require("./assets/map_icon_white.png")}
          style={styles.image}
        />
      </Pressable>
    </View>
  );
};
export default NavigateBtn;
