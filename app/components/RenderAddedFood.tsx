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
    const date = item?.date ? item.date.toDate().toLocaleTimeString() : '';

    return (

        <View style={tw`bg-white shadow-md rounded-2xl w-full h-[200px] my-1 pt-2 pl-3`}>

            <View style={tw`flex flex-row gap-x-3`}>
                <Text style={tw`text-black text-lg`}>{item.title}  -</Text>
                <Text style={tw`text-black text-lg pr-3`}>{item.grams} {t('grams')}  -</Text>
                <Text style={tw`text-black text-lg`}>{date}</Text>
            </View>
            
            <Text style={tw`text-black text-lg`}>{calories} {t('calories')}</Text>
            <Text style={tw`text-black text-lg`}>{protein}г. {t('protein')}</Text>
            <Text style={tw`text-black text-lg`}>{carbs}г. {t('carbs')}</Text>
            <Text style={tw`text-black text-lg`}>{fat}г. {t('fat')}</Text>
            

            <Button title={t('delete')} onPress={() => onDelete(item)}/>

        </View>
    )
}
export default RenderAddedFood;