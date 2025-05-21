import { View, Pressable, Image } from 'react-native'
import React from 'react'
import { ButtonIconStyles as styles } from './styles.js'

const SortDescendingBtn = ({onPressEvent}) => {
  return (
    <View style={styles.viewContainerTight}>
        <Pressable style={styles.containerTight} onPress={()=>{onPressEvent()}}>
            <Image style={styles.image} source={require("./assets/Down.png")}/>
        </Pressable>
    </View>
  )
}

export default SortDescendingBtn