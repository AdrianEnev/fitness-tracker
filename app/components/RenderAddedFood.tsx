import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from "twrnc";
import { doc, deleteDoc } from 'firebase/firestore';
import { useTranslation } from 'react-i18next';

const RenderAddedFood = ({ item, onDelete }: { item: any, onDelete: (item: any) => void }) => {

    // da probvam da napravq purvo da se iztrie view elementa i togava ot bazata danni che da nqma delay\\

    const {t} = useTranslation();

    const calories = item?.calories ?? 0;
    const protein = Number(item?.protein ?? 0).toFixed(0);
    const carbs = Number(item?.carbs ?? 0).toFixed(0);
    const fat = Number(item?.fat ?? 0).toFixed(0);
    const dateOptions = { hour: '2-digit', minute: '2-digit' };
    const date = item?.date ? item.date.toDate().toLocaleTimeString([], dateOptions) : '';

    const getInitials = (name: string) => {
        return name.split(' ').map(word => word[0]).join('').substring(0, 3).toUpperCase();
    }

    return (

        <View style={tw`bg-[#fd2e5b] shadow-md rounded-2xl w-full h-full my-2 pt-2 pl-3`}>

            <View style={tw`flex flex-row h-[30%]`}>
                
                {/* Logo */}
                <View style={tw`h-full py-2`}>
                    <View style={tw`w-16 h-16 rounded-lg bg-white flex items-center justify-center`}>
                        <Text style={tw`text-3xl font-medium text-black`}>{getInitials(item.title)}</Text>
                    </View>
                </View>

                {/* Food Name + Grams */}
                <View style={tw`flex flex-col ml-2`}>
                    <Text style={tw`text-white text-2xl font-medium`}>{item.title}</Text>
                    <Text style={tw`text-white text-lg font-medium`}>{item.grams} {t('grams')}</Text>
                </View>

            </View>
        </View>
    )
}
export default RenderAddedFood;