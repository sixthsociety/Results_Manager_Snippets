import { StyleSheet, View, Pressable, Image } from 'react-native'
import React, { useState } from 'react'
import { CheckboxStyles as styles, colorPallette } from './styles.js'

const CheckBoxBtn = ({ value, onPressEvent }) => {

    const [checked, setChecked] = useState(value);
    const [image, setImage] = useState(value ? require("./assets//Check_Icon.png") : "");

    function OnPress() {
        onPressEvent(!value);
        !checked ? setImage(require("./assets//Check_Icon.png")) : setImage("");
        setChecked(!checked);
    }

    const backgroundStyle = StyleSheet.create({
        IconStyle: {
            borderColor: colorPallette.primary_silver_blue,
            backgroundColor: checked ? colorPallette.primary_silver_blue : "rgba(242, 242, 242, 0.5)",
        }
    })

    return (
        <View style={styles.viewContainer}>
            <Pressable style={[styles.container, backgroundStyle.IconStyle]} onPress={() => { OnPress() }}>
                <Image style={styles.image} source={image} />
            </Pressable>
        </View>
    )
}

export default CheckBoxBtn

