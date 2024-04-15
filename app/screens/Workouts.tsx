import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const Workouts = ({navigation}: any) => {
    return (
        <View style={tw`mt-10`}>

            <Button title='Запазени тренировки' onPress={() => navigation.navigate("Запазени-Тренировки")}/>
            <Button title='Тренировъчни програми' onPress={() => navigation.navigate("Програми")}/>
            
        </View>
    )
}

export default Workouts