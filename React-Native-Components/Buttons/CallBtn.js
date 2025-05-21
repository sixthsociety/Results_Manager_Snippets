import { View, Pressable, Image } from 'react-native'
import React from 'react'
import { styles } from './styles.js'

const CallBtn = ({onPressEvent}) => {
  return (
    <View style={styles.viewContainer}>
        <Pressable style={styles.container} onPress={()=>{onPressEvent()}}>
            <Image style={styles.image} source={require("./assets/phone-call.png")}/>
        </Pressable>
    </View>
  )
}

export default CallBtn