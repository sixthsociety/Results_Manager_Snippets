import { View, Pressable, Image, Text } from 'react-native'
import React, { useState } from "react";
import { styles } from './styles.js'

/**
 * @name AllButtons - Is not reflective of the truth. We have other buttons not contained within this libary such as the PunchClockButton and CallBtn and Navigate Btn.
 * @param {Function} onPressEvent - A custom function to be called when the button is pressed. The developer can pass in any function they want to be called when the button is pressed via this prop.
 * @returns A selection of available buttons for use in the application.
 */


export const AddBtn = ({ onPressEvent, buttonLabel = "Add" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={[styles.containerAdd, isHovered && styles.hoverAdd]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

export const CancelBtn = ({ onPressEvent, buttonLabel = "Cancel" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={[styles.containerCancel, isHovered && styles.hoverCancel]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Text style={styles.cancelText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

export const DeleteTextBtn = ({ onPressEvent, buttonLabel = "Delete" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={[styles.containerDeleteTextBtn, isHovered && styles.hoverDelete]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

export const DeleteBtn = ({ onPressEvent }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={[styles.containerDelete, isHovered && styles.hoverDelete]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/delete_icon.png")} />
      </Pressable>
    </View>
  );
};

export const XBtn = ({ onPressEvent }) => {
  return (
    <Pressable onPress={() => { onPressEvent() }}>
      <Image style={styles.image} source={require("./assets/X.png")} />
    </Pressable>
  )
}

export const ModalXBtn = ({ onPressEvent }) => {
  return (
    <Pressable onPress={() => { onPressEvent() }}>
      <Image style={styles.ModalXBtn} source={require("./assets/X.png")} />
    </Pressable>
  )
}

export const CustomTextBtn = ({ onPressEvent, buttonLabel = "Search" }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.viewContainer}>
      <Pressable
        style={[styles.containerCustomTextBtn, isHovered && styles.hoverCustom]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Text style={styles.buttonText}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
};

export const EditBtn = ({ onPressEvent }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.imageBtnView}>
      <Pressable
        style={[styles.imageBtnContainer, isHovered && styles.hoverCustom]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/Edit-Icon.png")} />
      </Pressable>
    </View>
  )
}

export const SaveBtnIcon = ({ onPressEvent }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.imageBtnView}>
      <Pressable
        style={[styles.saveImageBtnContainer, isHovered && styles.hoverAdd]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/save_icon_white.png")} />
      </Pressable>
    </View>
  )
}

export const CancelBtnIcon = ({ onPressEvent }) => {

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.imageBtnView}>
      <Pressable
        style={[styles.cancelBtnIconContainer, isHovered && styles.hoverCancel]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/cancel_icon_red.png")} />
      </Pressable>
    </View>
  )
}

export const CheckmarkIcon = ({ }) => {

  return (
    <View style={styles.imageBtnView}>
      <View
        style={styles.confirmIconContainer}

      >
        <Image style={styles.image} source={require("./assets/checkmark_icon_green.png")} />
      </View>
    </View>
  )
}

export const RedXIcon = ({ }) => {

  return (
    <View style={styles.imageBtnView}>
      <View
        style={styles.confirmIconContainer}

      >
        <Image style={styles.image} source={require("./assets/x_icon_red.png")} />
      </View>
    </View>
  )
}

export const SearchBtn = ({ onPressEvent }) => {

  return (
    <View style={styles.viewContainer}>
      <Pressable style={styles.container} onPress={onPressEvent}>
        <Image style={styles.image} source={require("./assets/Search-Icon.png")} />
      </Pressable>
    </View>
  )
}

export const NextBtn = ({ onPressEvent }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.imageBtnView}>
      <Pressable
        style={[styles.imageBtnContainer, isHovered && styles.hoverCustom]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/arrow_right_white.png")} />
      </Pressable>
    </View>
  )
}

export const PrevBtn = ({ onPressEvent, background }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  return (
    <View style={styles.imageBtnView}>
      <Pressable
        style={[styles.imageBtnContainer, isHovered && styles.hoverCustom]}
        onPress={onPressEvent}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Image style={styles.image} source={require("./assets/arrow_left_white.png")} />
      </Pressable>
    </View>
  )
}

export const Chevron = ({ state, onChange }) => {
  return (
    <Pressable style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }} onPress={() => { onChange(!state); }}>
      <Image style={styles.image} source={state ? require("./assets/chevron-down.png") : require("./assets/chevron-up.png")} />
    </Pressable>
  )
}