import { View, Text, FlatList } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { useTranslation } from 'react-i18next';
import Ionicons from '@expo/vector-icons/Ionicons';
import RenderGoalNutrients from './RenderGoalNutrients';

const RenderGoals = (
    {goalNutrients, currentNutrients, navigation}: any
) => {

    const {t} = useTranslation();

    /*const getCurrentDate = (): string => {

        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${day}/${month}/${year}`;

    };*/

    return (
        <View>

            <View style={tw`flex flex-row justify-between mt-3 mb-1`}>
                <Text style={tw`font-medium text-lg ml-3`}>{t('today')}</Text>
                <Text style={tw`font-medium text-base text-gray-500 mr-3 mt-1`} onPress={() => navigation.navigate('Настройки-Макронутриенти')}>Настройки {'>'}</Text>
            </View>
            
                
            <View style={tw`flex flex-row flex-wrap mx-1 gap-x-2 gap-y-2`}>

                {/* Kalorii */}
                <View style={tw`w-[49%] h-28 bg-white shadow-md rounded-lg bg-[#fff9f0]`}>

                    <View style={tw`flex flex-row gap-x-1 ml-1 mt-2`}>

                        <Ionicons name='flame-outline' size={24} color='orange' />

                        <View style={tw`mt-[-3px]`}>
                            <Text style={tw`text-lg`}>{t('calories')}</Text>
                        </View>

                    </View>
                    
                    <View style={tw`flex-1 flex-row items-end ml-2 mb-1`}>
                        <Text style={tw`text-2xl`}>2000</Text>
                        <Text style={tw`text-sm`}>/3000kcal</Text>
                    </View>
                    

                </View>

                <View style={tw`w-[49%] h-28 bg-[#f7feee] shadow-md rounded-lg`}>

                    <View style={tw`flex flex-row gap-x-1 ml-1 mt-2`}>

                        <Ionicons name='footsteps-outline' size={24} color='#bdf774' />

                        <View style={tw`mt-[-3px]`}>
                            <Text style={tw`text-lg`}>{t('steps')}</Text>
                        </View>

                        </View>

                        <View style={tw`flex-1 flex-row items-end ml-2 mb-1`}>
                            <Text style={tw`text-2xl`}>100</Text>
                            <Text style={tw`text-sm`}>/2100</Text>
                        </View>

                </View>

                {/* Makronutrienti */}
                <FlatList 
                    data={goalNutrients} 
                    renderItem={({item}) => <RenderGoalNutrients item={item} currentNutrients={currentNutrients} />}  
                    scrollEnabled={false}
                />

            </View>

        </View>
    )
}

export default RenderGoals