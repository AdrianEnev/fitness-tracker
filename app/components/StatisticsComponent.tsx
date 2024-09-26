import { View, Text } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons';
import { PieChart } from 'react-native-gifted-charts';

const StatisticsComponent = () => {
    return (
        <View style={tw`mt-3 mx-2 w-[96.5%] h-66 flex flex-row justify-between`}>
            
            <View style={tw`bg-[#e82045] w-full h-56 rounded-lg pt-1 pl-2`}>
                <Text style={tw`text-white font-medium text-xl`}>Statistics</Text>
            </View>
        

        </View>
    )
}

export default StatisticsComponent