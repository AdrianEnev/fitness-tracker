import { View, Text, Vibration } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import tw from 'twrnc'
import { bgLocaleConfig, deLocaleConfig, enLocaleConfig, frLocaleConfig, ruLocaleConfig } from "../../CalendarConfig";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import i18next from '../../services/i18next';

LocaleConfig.locales['bg'] = bgLocaleConfig;
LocaleConfig.locales['en'] = enLocaleConfig;
LocaleConfig.locales['fr'] = frLocaleConfig;
LocaleConfig.locales['ru'] = ruLocaleConfig;
LocaleConfig.locales['de'] = deLocaleConfig;


const Food = ({navigation}: any) => {

    const [localeKey, setLocaleKey] = useState(i18next.language);
    const [renderKey, setRenderKey] = useState(Date.now());

    useEffect(() => {
        const setLocale = (lng: any) => {
            // Assuming lng is one of 'bg', 'en', 'ge', 'fr', 'ru'
            LocaleConfig.defaultLocale = lng;
            // Update LocaleConfig with the new language's configuration
            switch (lng) {
                case 'bg':
                    LocaleConfig.locales[lng] = bgLocaleConfig;
                    break;
                case 'en':
                    LocaleConfig.locales[lng] = enLocaleConfig;
                    break;
                case 'de':
                    LocaleConfig.locales[lng] = deLocaleConfig;
                    break;
                case 'fr':
                    LocaleConfig.locales[lng] = frLocaleConfig;
                    break;
                case 'ru':
                    LocaleConfig.locales[lng] = ruLocaleConfig;
                    break;
                default:
                    // Handle unknown language
                    break;
            }
            LocaleConfig.defaultLocale = lng;
            setLocaleKey(lng); // Update locale key
            setRenderKey(Date.now()); // Update render key to force re-render
        };
        setLocale(i18next.language);
    
        i18next.on('languageChanged', setLocale);
    
        return () => {
            i18next.off('languageChanged', setLocale);
        };
    }, []);

    const currentDate = new Date().toISOString().split('T')[0].split('-').join('-');
   
    return (
        <View style={tw`bg-white`}>

            <View style={tw`bg-white`}>

                <CalendarList 
                    key={renderKey}
                    horizontal={false}
                    pagingEnabled={false}
                    pastScrollRange={6}
                    futureScrollRange={6}
                    scrollEnabled={true}
                    onDayPress={(day: any) => {
                        navigation.navigate("Хранене-Ден", {date: day});
                    }}
                    markedDates={{
                        [currentDate]: {selected: true, selectedColor: '#fd3e6b', textColor: 'white'},
                    }}
                />
                

            </View>
            
        </View>
    )
}

export default Food