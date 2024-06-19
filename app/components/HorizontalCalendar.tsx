import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';

const HorizontalCalendar = ({navigation}: any) => {

    const [startDate, setStartDate] = useState(new Date());
    const [dates, setDates] = useState<Date[]>([]);

    const getDatesRange = () => {
        let dates = [];
        for (let i = -4; i <= 0; i++) { 
            let date = new Date(startDate);
            date.setDate(date.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const formatDate = (date: Date, format: string) => {

        const weekDaysBG = ['Нед', 'Пон', 'Вт', 'Ср', 'Чет', 'Пет', 'Съб'];
        //const weekDaysEN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

        switch (format) {
            case 'ddd':
                // Assuming this returns the day of the week in a short format (e.g., Mon, Tue)
                const dayOfWeek = date.getDay();
                return weekDaysBG[dayOfWeek];
            case 'DD.MM':
                // Manually constructing the date string in DD.MM format
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
                return `${day}.${month}`;
            default:
                return date.toLocaleDateString('bg-BG');
        }
    };

    const isToday = (date: Date) => {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    };

    useEffect(() => {
        const dates = getDatesRange();
        setDates(dates);
    }, [startDate]);

    return (
        <View>
            <View style={tw`flex flex-row justify-between mt-4 mx-2`}>
                {dates.map((date, index) => (
                    <Pressable key={index} style={tw`${isToday(date) ? 'bg-red-500' : 'bg-white shadow-md'} w-[18%] h-20 rounded-xl flex items-center pt-1`}
                    onPress={() => {

                        const dateString = date.toISOString().split('T')[0];
                        const day = date.getDate();
                        const month = date.getMonth() + 1; // JavaScript months are 0-indexed
                        const timestamp = date.getTime();
                        const year = date.getFullYear();

                        navigation.navigate('Хранене-Ден', {
                            date: {
                                dateString,
                                day,
                                month,
                                timestamp,
                                year
                            }
                        });
                    }}
                    >
                        <Text style={tw`${isToday(date) ? 'text-white' : 'text-black'} font-medium text-lg mt-2`}>{formatDate(date, 'ddd')}</Text>
                        <Text style={tw`${isToday(date) ? 'text-white' : 'text-black'} font-medium`}>{formatDate(date, 'DD.MM')}</Text> 
                    </Pressable>
                ))}
            </View>
        </View>
    );
};

export default HorizontalCalendar;