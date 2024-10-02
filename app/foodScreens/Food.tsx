import { View, Text, Vibration } from 'react-native'
import React, { useState, useEffect, useContext } from 'react'
import tw from 'twrnc'
import { bgLocaleConfig, deLocaleConfig, enLocaleConfig, frLocaleConfig, ruLocaleConfig } from "../../CalendarConfig";
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import i18next from '../../services/i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getEmail from '../use/useGetEmail';

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

    const checkAsyncStorageDates = async () => {
        // get all foodDays from async storage (example: 'email-foodDay-30-9-2024)
        const email = await getEmail();
        const keys = await AsyncStorage.getAllKeys();
        const foodDayKeys = keys.filter((key: string) => key.includes(`${email}-foodDay`) && !key.includes('nutrients'));
        const dates = foodDayKeys.map((key: string) => key.split('-').slice(-3).join('-'));
        const uniqueDates = Array.from(new Set(dates));
    
        const formattedDates = uniqueDates.map(date => {
            const [day, month, year] = date.split('-');
            return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        });
        
        const newMarkedDates = formattedDates.reduce((acc: {[key: string]: any}, date) => {
            acc[date] = { selected: true, selectedColor: '#3f8aff', textColor: 'white' };
            return acc;
        }, {});
    
        setMarkedDates(newMarkedDates);
    };
    
    const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            checkAsyncStorageDates();
        });

        return unsubscribe;
    }, [navigation]);
   
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
                        ...markedDates,
                        [currentDate]: {selected: true, selectedColor: '#fd3e6b', textColor: 'white'},
                    }}
                    onDayLongPress={(day: any) => {
                        console.log('held')
                    }}
                />
                

            </View>
            
        </View>
    )
}

export default Food