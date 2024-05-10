import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import tw from 'twrnc'
import { bgLocaleConfig, enLocaleConfig } from "../../CalendarConfig";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import i18next from '../../services/i18next';
import { useTranslation } from 'react-i18next';

LocaleConfig.locales['bg'] = bgLocaleConfig;
LocaleConfig.locales['en'] = enLocaleConfig;

const Food = ({navigation}: any) => {

    const [key, setKey] = useState(i18next.language);

    useEffect(() => {
        LocaleConfig.defaultLocale = i18next.language;
        setKey(i18next.language);
    }, []);

    useEffect(() => {
        i18next.on('languageChanged', (lng) => {
            LocaleConfig.defaultLocale = lng;
            setKey(lng);
        });
    }, []);

    const currentDate = new Date().toISOString().split('T')[0].split('-').join('-');

    //<View style={tw`mt-8`}>
        //<Text style={tw`text-xl font-bold text-center mt-5`}>Хранителен режим</Text>
   // </View>
   
    return (
        <View style={tw`bg-white`}>

           
            
            <View style={tw`m-3 mt-10 bg-white`}>

                <CalendarList 
                    key={key}
                    horizontal={false}
                    pagingEnabled={false}
                    pastScrollRange={6}
                    futureScrollRange={6}
                    scrollEnabled={true}
                    onDayPress={day => {
                        navigation.navigate("Хранене-Ден", {date: day});
                    }}
                    markedDates={{
                        [currentDate]: {selected: true, selectedColor: '#3b82f6', textColor: 'white'},
                    }}
                    
                />

            </View>

            
        </View>
    )
}

export default Food