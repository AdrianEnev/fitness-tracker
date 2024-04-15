import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { bgLocaleConfig } from "../../CalendarConfig";
import { Calendar, CalendarList, LocaleConfig } from 'react-native-calendars';

LocaleConfig.locales['bg'] = bgLocaleConfig;

const Food = ({navigation}: any) => {

    const currentDate = new Date().toISOString().split('T')[0].split('-').join('-');
    // ako dobavq .reverse() predi .join() shte stane 07-04-2024
   
    return (
        <View style={tw`bg-white`}>

            <View style={tw`mt-8`}>
                <Text style={tw`text-xl font-bold text-center mt-5`}>Хранителен режим</Text>
            </View>
            
            
            <View style={tw`m-3 bg-white`}>

                <CalendarList 
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