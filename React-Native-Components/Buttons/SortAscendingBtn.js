import { View, Pressable, Image } from 'react-native'
import React from 'react'
import { ButtonIconStyles as styles } from './styles.js'

const SortAscendingBtn = ({onPressEvent}) => {
  return (
    <View style={styles.viewContainerTight}>
        <Pressable style={styles.containerTight} onPress={()=>{onPressEvent()}}>
            <Image style={styles.image} source={require("./assets/Up.png")}/>
        </Pressable>
    </View>
  )
}

export default SortAscendingBtn
