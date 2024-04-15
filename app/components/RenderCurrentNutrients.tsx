import { View, Text } from 'react-native'
import React from 'react'
import tw from "twrnc";

const RenderCurrentNutrients = (item: any) => {

    const calories = item?.calories ?? 0;
    const protein = Number(item?.protein ?? 0).toFixed(0);
    const carbs = Number(item?.carbs ?? 0).toFixed(0);
    const fat = Number(item?.fat ?? 0).toFixed(0);

    return (

        <View style={tw`bg-white shadow-md rounded-lg w-full h-[170px] my-1 pt-2 pl-3`}>

            <View style={tw`flex flex-row justify-between`}>
                <Text style={tw`text-black text-lg`}>{item.title}</Text>
                <Text style={tw`text-black text-lg pr-3`}>{item.grams} грама</Text>
            </View>
            
            <Text style={tw`text-black text-lg`}>{calories} калории</Text>
            <Text style={tw`text-black text-lg`}>{protein}г. протеин</Text>
            <Text style={tw`text-black text-lg`}>{carbs}г. въглехидрати</Text>
            <Text style={tw`text-black text-lg`}>{fat}г. мазнини</Text>

        </View>
    )
}
export default RenderCurrentNutrients