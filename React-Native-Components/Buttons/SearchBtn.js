import { View, Pressable, Image } from 'react-native'
import React from 'react'
import { ButtonIconStyles as styles } from './styles.js'

const SearchBtn = ({ onPressEvent }) => {

    return (
        <View style={styles.viewContainer}>
            <Pressable style={styles.container} onPress={onPressEvent}>
                <Image style={styles.image} source={require("./assets/Search-Icon.png")} />
            </Pressable>
        </View>
    )
}


export default SearchBtn