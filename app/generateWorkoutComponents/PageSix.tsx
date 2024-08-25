import { View, Text, Pressable, ScrollView } from 'react-native'
import React from 'react'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'

const PageFive = ({ equipment, setEquipment, equipmentGroup, setEquipmentGroup }: any) => {

    const toggleEquipment = (equipmentNumber: number) => {
        if (equipment.includes(equipmentNumber)) {
            setEquipment(equipment.filter((part: number) => part !== equipmentNumber));
        } else {
            setEquipment([...equipment, equipmentNumber]);
        }
    };

    return (
        <View style={tw`flex flex-col mt-[10%] h-full`}>

            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>What equipment do you have access to?</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-3 text-center`}>This will <Text style={tw`font-bold`}>only</Text> be used to generate a custom workout!</Text>
            </View>
          
            <ScrollView contentContainerStyle={tw`flex-1 flex-col gap-y-2 mx-5 mt-[5%]`}>

                <Text style={tw`text-lg font-medium text-gray-700`}>Select Group</Text>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipmentGroup === 1 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setEquipmentGroup(1)}
                >
                    <Ionicons name='barbell-outline' size={42} color={equipmentGroup === 1  ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 1  ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>No equipment</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipmentGroup === 2 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setEquipmentGroup(2)}
                >
                    <Ionicons name='flame-outline' size={42} color={equipmentGroup === 2 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 2 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Full gym</Text>
                </Pressable>

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipmentGroup === 3 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setEquipmentGroup(3)}
                >
                    <Ionicons name='pulse-outline' size={42} color={equipmentGroup === 3 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipmentGroup === 3 ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Calisthenics park</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipmentGroup === 4 ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => setEquipmentGroup(4)}
                >
                    <Ionicons name='pulse-outline' size={42} color={equipmentGroup === 4 ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
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

                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Barbells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Dumbbells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Machines</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Pull up Bar</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Dip Bar</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Kettlebells</Text>
                </Pressable>
                <Pressable style={tw`w-full h-[10.9%] rounded-2xl ${equipment.includes(4) ? "bg-green-400" : 'bg-gray-200'} flex flex-row gap-x-4 items-center pl-3 pb-1`}
                    onPress={() => toggleEquipment(4)}
                >
                    <Ionicons name='accessibility-outline' size={42} color={equipment.includes(4) ? 'white' : '#6b7280'} style={tw`mt-[6px]`} />
                    <Text style={tw`text-2xl font-medium ${equipment.includes(4) ? 'text-white' : 'text-gray-500'} mt-1 max-w-[85%]`}>Resistence Bands</Text>
                </Pressable>

                
            </ScrollView>

          
            
        </View>
    )
}

export default PageFive