import { View, Text, Pressable } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

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
        setEquipment(['barbells', 'dumbbells', 'machines', 'pull up bar', 'dip bar', 'kettlebells', 'resistence bands']);
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

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>What equipment do you have access to?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
            </View>
          
            <View style={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%] mb-26`} ref={equipmentRef}>

                <Text style={tw`text-lg font-medium text-gray-700`}>Select Group</Text>

                {/* No Equipment */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => noEquipmentSelected()}
                >
                    <Ionicons name='ban-outline' size={42} color={equipmentGroup === 1  ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 1  ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>No equipment</Text>
                </Pressable>

                {/* Full Gym */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => fullGymSelected()}
                >
                    <Ionicons name='barbell-outline' size={42} color={equipmentGroup === 2 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Full gym</Text>
                </Pressable>

                {/* Calisthenics Park */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => calisthenicsParkSelected()}
                >
                    <Ionicons name='sunny-outline' size={42} color={equipmentGroup === 3 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Calisthenics park</Text>
                </Pressable>

                {/* Home Equipment */}
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipmentGroup === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => homeEquipmentSelected()}
                >
                    <Ionicons name='home-outline' size={42} color={equipmentGroup === 4 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 4 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Home equipment</Text>
                </Pressable>    

                {/* ---------------------------------------------------------------------------------------------------------------------------------- */}
                <Text style={tw`text-xl font-medium text-center my-2`}>or</Text>
                {/* ---------------------------------------------------------------------------------------------------------------------------------- */}

                <View style={tw`flex flex-row gap-x-2`}>
                    <Text style={tw`text-lg font-medium text-gray-700`}>Select Individually</Text>
                    <Text style={tw`text-base mt-[2px] font-medium text-gray-500`}>({equipment.length})</Text>
                </View>

                <Text style={tw`font-medium text-sm text-gray-500 mt-[-8px]`}>(multiple options can be selected)</Text>

                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('barbells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('barbells')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('barbells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('barbells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Barbells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('dumbbells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('dumbbells')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('dumbbells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('dumbbells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Dumbbells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('machines') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('machines')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('machines') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('machines') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Machines</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('pull up bar') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('pull up bar')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('pull up bar') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('pull up bar') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Pull up Bar</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('dip bar') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('dip bar')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('dip bar') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('dip bar') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Dip Bar</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('kettlebells') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('kettlebells')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('kettlebells') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('kettlebells') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Kettlebells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-20 rounded-2xl ${equipment.includes('resistence bands') ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment('resistence bands')}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes('resistence bands') ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes('resistence bands') ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Resistence Bands</Text>
                </Pressable>

                
            </View>
        </View>
    )
}

export default PageSix