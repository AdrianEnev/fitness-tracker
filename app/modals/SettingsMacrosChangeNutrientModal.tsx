import { Keyboard, Modal, Pressable, View, Text, TextInput } from "react-native";
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import { normalizeValue } from "../use/useNormalizeValue";

interface SettingsMacrosChangeNutrientModalProps {
    nutrient: string;
    oldValue: string | number;
    setCalories: any;
    setProtein: any;
    setCarbs: any;
    setFat: any;
    isSettingsMacrosChangeNutrientModalVisible: boolean;
    setIsSettingsMacrosChangeNutrientModalVisible: (isVisible: boolean) => void;
}

const SettingsMacrosChangeNutrientModal = ({ nutrient, oldValue, setCalories, setProtein, setCarbs, setFat, isSettingsMacrosChangeNutrientModalVisible, setIsSettingsMacrosChangeNutrientModalVisible, position }: SettingsMacrosChangeNutrientModalProps & { position: { top: number, left: number } }) => {

    let tempValue = oldValue;

    const saveButtonPressed = () => {
        setIsSettingsMacrosChangeNutrientModalVisible(!isSettingsMacrosChangeNutrientModalVisible);
        Keyboard.dismiss();

        tempValue = Math.ceil(Number(normalizeValue(tempValue)));

        switch (nutrient) {
            case 'Calories':
                setCalories(tempValue);
                break;
            case 'Protein':
                setProtein(tempValue);
                break;
            case 'Carbs':
                setCarbs(tempValue);
                break;
            case 'Fat':
                setFat(tempValue);
                break;
            default:
                break;
        }
    };

    const SaveAndCancelIcons = () => {
        return (
            <View 
                style={tw
                `
                   w-[94%] flex-row gap-x-1 ml-[-3px] gap-y-2 ${nutrient === "Protein" ? 'mt-2' : nutrient === "Calories" ? 'mt-2' : 'mt-[-60px] mb-2'}
                `}>

                <Pressable style={tw`w-[24%] h-12 bg-[#fd3e54] rounded-xl shadow-lg flex items-center justify-center`} onPress={() => setIsSettingsMacrosChangeNutrientModalVisible(false)}>
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

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isSettingsMacrosChangeNutrientModalVisible}
            onRequestClose={() => {
                setIsSettingsMacrosChangeNutrientModalVisible(!isSettingsMacrosChangeNutrientModalVisible);
            }}
        >
            <View style={[tw`w-full h-[15%] mx-1 mt-1 absolute`, { top: position.top, left: position.left }]}>
                
                {((nutrient === 'Carbs' || nutrient === 'Fat')) && (
                    <SaveAndCancelIcons />
                )}

                <View style={tw` 
                    rounded-xl w-[44%] h-full
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
                                !tempValue.toString() ? '0' : tempValue.toString() 
                            }
                            keyboardType={
                                'numeric'
                            }
                            autoFocus={true}
                            maxLength={nutrient === 'Calories' ? 4 : 3}
                            selectionColor={'white'}
                        />
                    </View>

                </View>
                            
                {((nutrient !== 'Carbs' && nutrient !== 'Fat')) && (
                    <SaveAndCancelIcons />
                )}
                
            </View>
        </Modal>
    );
};

export default SettingsMacrosChangeNutrientModal;