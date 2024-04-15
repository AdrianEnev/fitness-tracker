import { View, Text, TextInput } from 'react-native'
import React from 'react'
import tw from "twrnc";

const SavedWorkoutExercises = ({ item }: any) => {
  return (
    <View>
        <View>

            <View style={tw`flex flex-row justify-between`}>
                <Text style={tw`text-lg ml-3 mt-2`}>Серия</Text>
                <Text style={tw`text-lg mt-2`}>Повторения</Text>
                <Text style={tw`text-lg mt-2`}>Тежест</Text>
                <Text style={tw`text-lg mr-3 mt-2`}>RPE</Text>
            </View>

            <View style={tw`my-3 ml-5`}>
                {Array.from({ length: item.sets }, (_, index) => (

                    <View style={tw`flex flex-row justify-between`} key={`set-${item.id}-${index}`}>

                        <Text style={tw`text-lg ml-3`}>{index + 1}</Text>

                        <Text
                        key={index.toString()}
                        style={tw`mb-5 mr-3`}></Text>

                        <Text
                        key={index.toString()}
                        style={tw`mb-5`}></Text>

                        <Text
                        key={index.toString()}
                        style={tw`mb-5 mr-4`}></Text>

                    </View>
                
                ))}
            </View>

        </View>
    </View>
  )
}

export default SavedWorkoutExercises