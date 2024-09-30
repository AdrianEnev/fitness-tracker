import { View, Text, Pressable } from 'react-native'
import React, { useRef, useState } from 'react'
import tw from 'twrnc'
import { BlurView } from 'expo-blur';
import AddFoodChangeNutrientModal from '../modals/AddFoodChangeNutrientModal';
import BottomNavigationBar from '../components/BottomNavigationBar';
import { Slider } from 'react-native-awesome-slider';
import { useSharedValue } from 'react-native-reanimated';

const AddFoodNutrientsComponent = (
    {navigation, name, setName, calories, protein, carbs, fat, setCalories, setProtein, setCarbs, setFat, saveFood}: 
    {navigation: any, name: string, setName: any, calories: any, protein: any, carbs: any, fat: any, setCalories: any, setProtein: any, setCarbs: any, setFat: any, saveFood: () => void}
) => {

    const [isChangeValueModalVisible, setIsChangeValueModalVisible] = useState(false);
    const [selectedNutrient, setSelectedNutrient] = useState('');

    const [nutrientPosition, setNutrientPosition] = useState({ top: 0, left: 0 });

    const nameRef = useRef(null)
    const calorieRef = useRef(null);
    const proteinRef = useRef(null);
    const carbRef = useRef(null);
    const fatRef = useRef(null);

    const handlePress = (nutrient: string, ref: any) => {
        ref.current.measure((fx: number, fy: number, width: number, height: number, px: number, py: number) => {
            setSelectedNutrient(nutrient);
            setNutrientPosition({ top: py, left: px });
            setIsChangeValueModalVisible(true);
        });
    };

    const progress = useSharedValue(30);
    const minimumValue = useSharedValue(0);
    const maximumValue = useSharedValue(100);

    return (

        <>
            { isChangeValueModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <View style={tw`flex-1`}>

                <AddFoodChangeNutrientModal
                    nutrient={selectedNutrient}
                    oldValue={selectedNutrient === 'Calories' ? calories : selectedNutrient === 'Protein' ? protein : selectedNutrient === 'Carbs' ? carbs : selectedNutrient === 'Fat' ? fat : name}
                    setName={setName}
                    setCalories={setCalories}
                    setProtein={setProtein}
                    setCarbs={setCarbs}
                    setFat={setFat}
                    isAddFoodChangeNutrientModalVisible={isChangeValueModalVisible}
                    setIsAddFoodChangeNutrientModalVisible={setIsChangeValueModalVisible}
                    position={nutrientPosition}
                />
                
                <View style={tw`w-[94.5%] h-[20%] mx-3 mt-2 flex flex-row justify-between flex-wrap gap-y-3`}>

                    <Pressable ref={nameRef} style={tw`w-[100%] h-[70%] bg-[#9263fa] rounded-xl`} onPress={() => {
                        handlePress('Food Name', nameRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center my-1`}>Food Name</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{name}</Text>
                        </View>

                    </Pressable>


                    <Pressable ref={calorieRef} style={tw`w-[49%] h-full bg-[#3f8aff] rounded-xl`} onPress={() => {
                        handlePress('Calories', calorieRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Calories</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!calories ? '0' : calories}kcal</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={proteinRef} style={tw`w-[49%] h-full bg-[#fd3e54] rounded-xl`} onPress={() => {
                        handlePress('Protein', proteinRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Protein</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!protein ? '0' : protein}g</Text>
                        </View>

                    </Pressable>

                    <Pressable ref={carbRef} style={tw`w-[49%] h-full bg-[#0fbf8f] rounded-xl`} onPress={() => {
                        handlePress('Carbs', carbRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Carbs</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!carbs ? '0' : carbs}g</Text>
                        </View>

                    </Pressable>
                    
                    <Pressable ref={fatRef} style={tw`w-[49%] h-full bg-[#ffca2c] rounded-xl`} onPress={() => {
                        handlePress('Fat', fatRef)
                    }}>

                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Fat</Text>

                        <View style={tw`flex-1 items-center justify-center mb-4`}>
                            <Text style={tw`text-4xl text-white font-medium text-center`}>{!fat ? '0' : fat}g</Text>
                        </View>

                    </Pressable>
                </View>

            </View>
        </>
    )
}

export default AddFoodNutrientsComponent