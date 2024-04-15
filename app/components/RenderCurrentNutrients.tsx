import { View, Text } from 'react-native'
import React from 'react'
import tw from "twrnc";

const RenderCurrentNutrients = (item: any) => {
    return (

        <View style={tw`bg-white shadow-md rounded-lg w-full h-[170px] my-1 pt-2 pl-3`}>

            <View style={tw`flex flex-row justify-between`}>
                <Text style={tw`text-black text-lg`}>{item.title}</Text>
                <Text style={tw`text-black text-lg pr-3`}>{item.grams} грама</Text>
            </View>
            
            <Text style={tw`text-black text-lg`}>{item.calories} калории</Text>
            <Text style={tw`text-black text-lg`}>{item.protein}г. протеин</Text>
            <Text style={tw`text-black text-lg`}>{item.carbs}г. въглехидрати</Text>
            <Text style={tw`text-black text-lg`}>{item.fat}г. мазнини</Text>

        </View>
    )
}
export default RenderCurrentNutrients