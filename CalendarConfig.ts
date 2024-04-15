import { LocaleConfig } from 'react-native-calendars';

export const bgLocaleConfig = {
    monthNames: [
        'Януари',
        'Февруари',
        'Март',
        'Април',
        'Май',
        'Юни',
        'Юли',
        'Август',
        'Септември',
        'Октомври',
        'Ноември',
        'Декември'
    ],
    monthNamesShort: ['Ян.', 'Фев.', 'Март', 'Апр.', 'Май', 'Юни', 'Юли', 'Авг.', 'Сеп.', 'Окт.', 'Ноем.', 'Дек.'],
    dayNames: ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'],
    dayNamesShort: ['Пон.', 'Вт.', 'Ср.', 'Чет.', 'Пет.', 'Съб.', 'Нед.'],
    today: "Днес"
};

LocaleConfig.locales['bg'] = bgLocaleConfig;
LocaleConfig.defaultLocale = 'bg';

export default bgLocaleConfig;