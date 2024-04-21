import { View, Text, Button } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import { Switch } from 'react-native';
import i18next, { languageResources } from '../../services/i18next';
import { useTranslation } from 'react-i18next';

const Settings = ({navigation}: any) => {

    const { t } = useTranslation();
    i18next.changeLanguage('bg');

    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState)

    return (
        <View style={tw`mt-10`}>

            <Button title='Акаунт' onPress={() => navigation.navigate('Настройки-Акаунт')}/>

            <Button title={t('macronutrients')} onPress={() => navigation.navigate('Настройки-Макронутриенти')}/>

            <View style={tw`flex flex-row justify-between mx-32 mt-5`}>
                <Text>LANGUAGE todo!</Text>

                <Text>Switch</Text>
            </View>


            <View style={tw`flex flex-row justify-between mx-32 mt-5`}>

                <Text>FACEID todo!</Text>

                <Switch
                    trackColor={{true: '#ffffff'}}
                    ios_backgroundColor="#3e3e3e"
                    thumbColor={isEnabled ? '#50C878' : '#FF5733'}
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />

            </View>

        </View>
    )
}

export default Settings