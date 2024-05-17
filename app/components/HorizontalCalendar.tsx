import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from 'twrnc'
import i18next from 'i18next'
import { useFocusEffect } from '@react-navigation/native'

const HorizontalCalendar = () => {

    const [currentLanguage, setCurrentLanguage] = useState('');

    useFocusEffect(() => {
        setCurrentLanguage(i18next.language);
    })
   
    const weekDaysBG = ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пет.', 'Съб.', 'Нед.'];
    const weekDaysEn = ['Mon.', 'Tue.', 'Wed.', 'Thu.', 'Fri.', 'Sat.', 'Sun.'];

    const [selectedDate, setSelectedDate] = useState(new Date());

    const generateDates = () => {
        let dates = [];
        for (let i = 0; i < 6; i++) {
            let date = new Date();
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    }

    return (
        <View style={tw`bg-white w-full h-32 shadow-lg rounded-lg flex-row justify-around items-center`}>
            {generateDates().map((date, index) => (
                <TouchableOpacity key={index} onPress={() => setSelectedDate(date)} 
                    style={
                        [tw
                            `p-2 rounded-lg text-center text-xl h-26`, 
                            date.getDate() === selectedDate.getDate() ? tw`bg-blue-200` : tw`bg-white`
                        ]
                    }>

                    <Text style={[tw`text-center text-base mb-2`, date.getDate() === selectedDate.getDate() ? tw`text-blue-400` : tw`text-gray-400`]}>
                        {weekDaysBG[date.getDay()]}
                    </Text>

                    <Text style={[tw`p-2 rounded-lg text-center text-2xl`, date.getDate() === selectedDate.getDate() ? tw`text-blue-400` : tw`text-black`]}>
                        {date.getDate()}
                    </Text>

                </TouchableOpacity>
            ))}
        </View>
    )
}

export default HorizontalCalendar