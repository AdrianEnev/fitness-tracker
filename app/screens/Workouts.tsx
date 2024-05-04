import { View, Text, Button } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const Workouts = ({navigation}: any) => {

    const { t } = useTranslation();

    return (
        <View style={tw`mt-10`}>

            <Button title={t('saved-workouts')} onPress={() => navigation.navigate("Запазени-Тренировки")}/>
            <Button title={t('workout-splits')} onPress={() => navigation.navigate("Програми")}/>
            
        </View>
    )
}

export default Workouts