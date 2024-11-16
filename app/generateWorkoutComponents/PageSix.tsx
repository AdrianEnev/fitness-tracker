import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import i18next from 'i18next'

const PageSix = ({ equipment, setEquipment, equipmentGroup, setEquipmentGroup, scrollToEquipment, equipmentRef }: any) => {

    const toggleEquipment = (equipmentName: string) => {
        if (equipment.includes(equipmentName)) {
            setEquipment(equipment.filter((item: string) => item !== equipmentName));
        } else {
            setEquipment([...equipment, equipmentName]);
        }
    };

    const noEquipmentSelected = () => {
        setEquipmentGroup(1);
        setEquipment([]);
    }
    const fullGymSelected = () => {
        setEquipmentGroup(2);
        setEquipment(['barbells', 'dumbbells', 'machines', 'pull up bar', 'dip bar', "bench"]);
        scrollToEquipment();
    }
    const calisthenicsParkSelected = () => {
        setEquipmentGroup(3);
        setEquipment(['pull up bar', 'dip bar']);
        scrollToEquipment();
    }
    const homeEquipmentSelected = () => {
        setEquipmentGroup(4);
        setEquipment(['barbells', 'dumbbells', 'resistence bands']);
        scrollToEquipment();
    }

    const {t} = useTranslation();

    const currentLanguage = i18next.language;

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>{t(`what-equipment-do-you-have-available`)}</Text>

                {currentLanguage === 'en' ? 
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will<Text style={tw`font-bold`}>only</Text> be used to generate a custom workout</Text> : currentLanguage == "bg" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Това ще бъде използвано <Text style={tw`font-bold`}>само</Text> за създаване на тренировка</Text> ) : currentLanguage == "de" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Dies wird<Text style={tw`font-bold`}>nur</Text> verwendet, um ein individuelles Training zu erstellen</Text> ) : currentLanguage == "fr" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Cela sera<Text style={tw`font-bold`}>uniquement</Text> utilisé pour générer un entraînement personnalisé</Text> ) : currentLanguage == "ru" ? (
                    <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>Это будет<Text style={tw`font-bold`}>только</Text> использоваться для создания индивидуальной тренировки</Text>
                ) : null}

            </View>
          
            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%] mb-26`} ref={equipmentRef}>

                <Text style={tw`text-lg font-medium text-gray-700`}>{t(`select-group`)}</Text>

                {/* No Equipment */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => noEquipmentSelected()}
                >
                    <Ionicons name='ban-outline' size={42} color={equipmentGroup === 1  ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 1  ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`no-equipment`)}</Text>
                </Pressable>

                {/* Full Gym */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => fullGymSelected()}
                >
                    <Ionicons name='barbell-outline' size={42} color={equipmentGroup === 2 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`full-gym`)}</Text>
                </Pressable>

                {/* Calisthenics Park */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => calisthenicsParkSelected()}
                >
                    <Ionicons name='sunny-outline' size={42} color={equipmentGroup === 3 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`calisthenics-park`)}</Text>
                </Pressable>

                {/* Home Equipment */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => homeEquipmentSelected()}
                >
                    <Ionicons name='home-outline' size={42} color={equipmentGroup === 4 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`home-equipment`)}</Text>
                </Pressable>    

                {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
                <Text style={tw`text-xl font-medium text-center my-2`}>{t(`or`)}</Text>
                {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

                <View style={tw`flex flex-row gap-x-2`}>
                    <Text style={tw`text-lg font-medium text-gray-700`}>{t(`select-individually`)}</Text>
                    <Text style={tw`text-base mt-[2px] font-medium text-gray-500`}>({equipment.length})</Text>
                </View>

                <Text style={tw`font-medium text-sm text-gray-500 mt-[-8px]`}>({t(`multiple-options-can-be-selected`)})</Text>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('barbells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('barbells')}
                >
                    <Ionicons name={equipment.includes('barbells') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('barbells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('barbells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`barbells`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('dumbbells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('dumbbells')}
                >
                    <Ionicons name={equipment.includes('dumbbells') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('dumbbells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('dumbbells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`dumbbells`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('machines') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('machines')}
                >
                    <Ionicons name={equipment.includes('machines') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('machines') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('machines') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`machines`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('pull up bar') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('pull up bar')}
                >
                    <Ionicons name={equipment.includes('pull up bar') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('pull up bar') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('pull up bar') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`pull-up-bar`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('dip bar') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('dip bar')}
                >
                    <Ionicons name={equipment.includes('dip bar') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('dip bar') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('dip bar') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`dip-bars`)}</Text>
                </Pressable>
                
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('bench') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('bench')}
                >
                    <Ionicons name={equipment.includes('bench') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('bench') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('bench') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`bench`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('kettlebells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('kettlebells')}
                >
                    <Ionicons name={equipment.includes('kettlebells') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('kettlebells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('kettlebells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`kettlebells`)}</Text>
                </Pressable>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('resistence bands') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('resistence bands')}
                >
                    <Ionicons name={equipment.includes('resistence bands') ? 'ellipse' : 'ellipse-outline'} size={42} color={equipment.includes('resistence bands') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('resistence bands') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>{t(`resistance-bands`)}</Text>
                </Pressable>
            

                
            </View>
        </View>
    )
}

export default PageSix