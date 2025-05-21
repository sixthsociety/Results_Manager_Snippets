import { Text, View, Pressable } from 'react-native'
import React, { useState } from 'react'
import { CheckboxStyles as styles, colorPallette } from '../../styles/styles'

/**
 * @param {function} setValue - function to set the value of the checkbox
 * @param {number} index - index of the checkbox
 * @returns - a yes or no checkbox which can alter a boolean value to true or false
 * @description - This component is a simple yes or no checkbox that can be used to alter a boolean value to true or false. Requires improvement for the following reasons:
 *  - The function names are not descriptive enough.
 *  - The component is not reusable due to the altering of an "assumed" boolean State. This may cause rendering issues since the state is not passed in as a prop.
 *  -- A solution would be to use a context var to store the state of the checkbox and pass in the context var as a prop. This would reduce the likelyhood of rendering infinite loops. 
 */
const YNCheckbox = ({setValue, index}) => {
  
    const [checkedYes, setY] = useState(false);
    const [checkedNo, setN] = useState(false);

    function CheckYes(){
        setY(true);
        setN(false);
        setValue(index, true);    
    }

    function CheckNo(){
        setN(true);
        setY(false);
        setValue(index, false);    
    }

    return (
        <View style={{flexDirection: 'row'}}>
            <Pressable style={[styles.container, {margin: 5, backgroundColor: checkedYes ? colorPallette.lightBlue : "rgba(242, 242, 242, 0.5)", borderColor: colorPallette.lightBlue}]} onPress={()=>{CheckYes()}}>
                <Text>Yes</Text>
            </Pressable>
            <Pressable style={[styles.container, {margin: 5, backgroundColor: checkedNo ? colorPallette.lightBlue : "rgba(242, 242, 242, 0.5)", borderColor: colorPallette.lightBlue}]} onPress={()=>{CheckNo()}}>
                <Text>No</Text>
            </Pressable>
        </View>
    )
}

export default YNCheckbox