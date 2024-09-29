import { Keyboard, Modal, Pressable, View, Text, TextInput } from "react-native";
import tw from 'twrnc'

interface ChangeNutrientModalProps {
    nutrient: string;
    oldValue: string | number;
    setNewCalories: any;
    setNewProtein: any;
    setNewCarbs: any;
    setNewFat: any;
    isChangeNutrientModalVisible: boolean;
    setIsChangeNutrientModalVisible: (isVisible: boolean) => void;
}

const ChangeNutrientModal = ({ nutrient, oldValue, setNewCalories, setNewProtein, setNewCarbs, setNewFat, isChangeNutrientModalVisible, setIsChangeNutrientModalVisible, position }: ChangeNutrientModalProps & { position: { top: number, left: number } }) => {

    let tempValue = oldValue;

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isChangeNutrientModalVisible}
            onRequestClose={() => {
                setIsChangeNutrientModalVisible(!isChangeNutrientModalVisible);
            }}
        >
            <Pressable style={[tw`w-full h-[15%] mx-1 mt-1 absolute`, { top: position.top, left: position.left }]} onPress={Keyboard.dismiss}>

                <Pressable style={tw` 
                    w-[44%] h-full rounded-xl
                    ${nutrient === 'Calories' ? 'bg-[#3f8aff]' : 
                    nutrient === 'Protein' ? 'bg-[#fd3e54]' : 
                    nutrient === "Carbs" ? 'bg-[#0fbf8f]' :
                    'bg-[#ffca2c]'} 
                    `
                }>

                    <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>{nutrient}</Text>

                    <View style={tw`flex-1 items-center justify-center mb-4`}>
                        <TextInput
                            style={tw`text-4xl text-white font-medium text-center`}
                            onChangeText={text => tempValue = text}
                            defaultValue={!tempValue.toString() ? '0' : tempValue.toString()}
                            keyboardType='numeric'
                            autoFocus={true}
                            
                        />
                    </View>

                </Pressable>

                <View style={tw`w-[94%] flex-col gap-y-2 mt-2`}>
                    <Pressable style={tw`w-[49%] h-12 bg-green-500 rounded-xl`}
                    onPress={() => {
                        setIsChangeNutrientModalVisible(!isChangeNutrientModalVisible);
                        Keyboard.dismiss();
                        if (nutrient === 'Calories') {
                            setNewCalories(tempValue);
                        } else if (nutrient === 'Protein') {
                            setNewProtein(tempValue);
                        } else if (nutrient === 'Carbs') {
                            setNewCarbs(tempValue);
                        } else {
                            setNewFat(tempValue);
                        }
                    }}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Save</Text>
                    </Pressable>
                    <Pressable style={tw`w-[49%] h-12 bg-red-500 rounded-xl`} onPress={() => setIsChangeNutrientModalVisible(false)}>
                        <Text style={tw`text-2xl text-white font-medium text-center mt-1`}>Cancel</Text>
                    </Pressable>
                </View>


            </Pressable>
        </Modal>
    );
}

export default ChangeNutrientModal
