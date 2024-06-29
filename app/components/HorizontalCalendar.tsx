import { View, Text, Pressable } from 'react-native';
import React, { useEffect, useState } from 'react';
import tw from 'twrnc';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';

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
        let weekDays;
        let monthNames;
    
        if (currentLanguage === 'bg') {
            weekDays = ['Нед', 'Пон', 'Вт', 'Ср', 'Чет', 'Пет', 'Съб'];
            monthNames = ['Яну', 'Фев', 'Мар', 'Апр', 'Май', 'Юни', 'Юли', 'Авг', 'Сеп', 'Окт', 'Ное', 'Дек'];
        } else { // Default to English if not Bulgarian
            weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
    
        switch (format) {
            case 'ddd':
                const dayOfWeek = date.getDay();
                return weekDays[dayOfWeek];
            case 'DD.MM':
                const day = date.getDate().toString().padStart(2, '0');
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                return `${day}.${month}`;
            case 'DD MMM':
                const dayOfMonth = date.getDate().toString().padStart(2, '0');
                const monthName = monthNames[date.getMonth()];
                return `${dayOfMonth} ${monthName}`;
            default:
                return date.toLocaleDateString(currentLanguage);
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

    const [currentLanguage, setCurrentLanguage] = useState('');

    useEffect(() => {
        const currentLang = i18next.language;
        setCurrentLanguage(currentLang);
    }, []);

    const {t} = useTranslation();

    return (
        <View>
            <View style={tw`flex flex-row justify-between mt-4 mx-2`}>
                {dates.map((date, index) => (
                    <Pressable key={index} style={tw`${isToday(date) ? 'bg-[#fd1c47]' : 'bg-white shadow-md'} w-[18%] h-20 rounded-xl flex items-center pt-1`}
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