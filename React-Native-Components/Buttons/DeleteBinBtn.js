import { View, Pressable, Image } from "react-native";
import React from "react";
import { styles } from "./styles.js";

const DeleteBinBtn = ({ onPressEvent }) => {
  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={styles.container}
        onPress={() => {
          onPressEvent();
        }}
      >
        <Image
          style={styles.image}
          source={require("./assets/Delete.png")}
        />
      </Pressable>
    </View>
  );
};

export default DeleteBinBtn;
