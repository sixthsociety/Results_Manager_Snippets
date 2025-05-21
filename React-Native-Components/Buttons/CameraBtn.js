import { Pressable, Image } from "react-native";
import React from "react";
import { ButtonIconStyles as styles } from './styles.js'

const CameraBtn = ({ onPressEvent }) => {
  return (
      <Pressable style={styles.container} onPress={() => { onPressEvent();}}>
        <Image style={styles.image} source={require("./assets/Camera.png")}/>
      </Pressable>
  );
};

export default CameraBtn;
