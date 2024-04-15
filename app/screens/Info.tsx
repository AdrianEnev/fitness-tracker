import { View, Button, Pressable, Text } from 'react-native'
import React from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH } from '../../firebaseConfig';

const Info = ({navigation}: any) => {

  const username = FIREBASE_AUTH.currentUser?.email?.split('@')[0];

  return (
    <View style={tw`h-full`}>

        <Text style={tw`text-xl m-2`}>Здравей, {username}</Text>

        <View style={tw`flex-1 justify-end`}>
            <Button title='Запазени тренировки' onPress={() => navigation.navigate('Запазени-Тренировки')}/>
            <Button title='Хранене' onPress={() => console.log('vodi kum vsichki dni za hranene koito sa obraboteni')}/>
        </View>

    </View>
  )
}

export default Info