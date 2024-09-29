import { Keyboard, Modal, Pressable, View, Text, TextInput } from "react-native";
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';

interface AddFoodChangeNutrientModalProps {
    nutrient: string;
    oldValue: string | number;
    setName: any;
    setCalories: any;
    setProtein: any;
    setCarbs: any;
    setFat: any;
    isAddFoodChangeNutrientModalVisible: boolean;
    setIsAddFoodChangeNutrientModalVisible: (isVisible: boolean) => void;
}

const AddFoodChangeNutrientModal = ({ nutrient, oldValue, setName, setCalories, setProtein, setCarbs, setFat, isAddFoodChangeNutrientModalVisible, setIsAddFoodChangeNutrientModalVisible, position }: AddFoodChangeNutrientModalProps & { position: { top: number, left: number } }) => {

    const saveButtonPressed = () => {
        setIsAddFoodChangeNutrientModalVisible(!isAddFoodChangeNutrientModalVisible);
        Keyboard.dismiss();
        if (nutrient === 'Calories') {
            setCalories(tempValue);
        } else if (nutrient === 'Protein') {
            setProtein(tempValue);
        } else if (nutrient === 'Carbs') {
            setCarbs(tempValue);
        } else if (nutrient === 'Fat') {
            setFat(tempValue);
        } else {
            setName(tempValue);
        }
    }
    
    const SaveAndCancelButtons = () => {
        return (
            <View 
                style={tw
                `
                    w-[94%] flex flex-row justify-between mt-3
                `}>

                <Pressable style={tw`w-[49%] h-12 bg-[#fd3e54] rounded-xl shadow-lg`} onPress={() => setIsAddFoodChangeNutrientModalVisible(false)}>
                    <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Cancel</Text>
                </Pressable>

                <Pressable style={tw`w-[49%] h-12 bg-[#0fbf70] rounded-xl shadow-lg`}
                    onPress={() => {
                        saveButtonPressed()
                    }}
                >
                    <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Save</Text>
                </Pressable>

            </View>
        );
    };

    const SaveAndCancelIcons = () => {
        return (
            <View 
                style={tw
                `
                   w-[94%] flex-row gap-x-1 ml-[-3px] gap-y-2 ${nutrient === "Protein" ? 'mt-2' : nutrient === "Calories" ? 'mt-2' : 'mt-[-60px] mb-2'}
                `}>

                <Pressable style={tw`w-[24%] h-12 bg-[#fd3e54] rounded-xl shadow-lg flex items-center justify-center`} onPress={() => setIsAddFoodChangeNutrientModalVisible(false)}>
                    <Ionicons name='close-outline' size={48} color='white' />
                </Pressable>

                <Pressable style={tw`w-[24%] h-12 bg-[#0fbf70] rounded-xl shadow-lg flex items-center justify-center`}
                    onPress={() => {
                        saveButtonPressed()
                    }}
                >
                    <Ionicons name='checkmark' size={48} color='white' />
                </Pressable>
                
            </View>
        );
    };

    let tempValue = oldValue;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isAddFoodChangeNutrientModalVisible}
            onRequestClose={() => {
                setIsAddFoodChangeNutrientModalVisible(!isAddFoodChangeNutrientModalVisible);
            }}
        >
            <View style={[tw`w-full h-[15%] mx-1 mt-1 absolute`, { top: position.top, left: position.left }]}>
                
                {((nutrient === 'Carbs' || nutrient === 'Fat')) && (
                    <SaveAndCancelIcons />
                )}

                <View style={tw` 
                    ${nutrient === 'Food Name' ? 'w-[92.5%] h-[70%] mr-[8px]' : 'w-[44%] h-full'}  rounded-xl
                    ${nutrient === 'Calories' ? 'bg-[#3f8aff] ml-[1.5px]' : 
                    nutrient === 'Protein' ? 'bg-[#fd3e54] ml-[1px]' : 
                    nutrient === "Carbs" ? 'bg-[#0fbf8f] ml-[1.5px]' :
                    nutrient === "Fat" ? 'bg-[#ffca2c] mr-[1.5px]' :
                    'bg-[#9263fa]'
                    }`
                }>

                    <Text style={tw`text-2xl text-white font-semibold text-center mt-1`}>{nutrient}</Text>

                    <View style={tw`flex-1 items-center justify-center mb-2`}>
                        <TextInput
                            style={tw`text-4xl text-white font-medium text-center`}
                            onChangeText={text => tempValue = text}
                            defaultValue={
                                nutrient !== 'Food name' ? !tempValue.toString() ? '0' : tempValue.toString() : oldValue.toString()
                            }
                            keyboardType={
                                nutrient !== 'Food Name' ? 'numeric' : 'default'
                            }
                            autoFocus={true}
                            maxLength={nutrient !== 'Food Name' ? 3 : 100}
                            selectionColor={'white'}
                        />
                    </View>

                </View>
                            
                {((nutrient !== 'Carbs' && nutrient !== 'Fat') && nutrient !== 'Food Name') && (
                    <SaveAndCancelIcons />
                )}
                {(nutrient === 'Food Name') && (
                    <SaveAndCancelButtons />
                )}
                

            </View>
        </Modal>
    );
};

export default AddFoodChangeNutrientModal;