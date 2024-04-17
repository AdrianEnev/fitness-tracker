import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc'

const Settings = ({navigation}: any) => {
    return (
        <View style={tw`mt-10`}>
            <Button title='Акаунт' onPress={() => navigation.navigate('Настройки-Акаунт')}/>
            <Button title='Макронутриенти' onPress={() => navigation.navigate('Настройки-Макронутриенти')}/>
            <Text>LANGUAGE todo!</Text>
        </View>
    )
}

export default Settings