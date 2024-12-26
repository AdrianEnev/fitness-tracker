import { View, Text, Modal, Pressable, Keyboard, TextInput, ActivityIndicator } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React, { useContext} from 'react'
import tw from 'twrnc'
import GlobalContext from '../../GlobalContext';

interface LungeCoinsModalProps {
    isLungeCoinsModalVisible: boolean;
    setIsLungeCoinsModalVisible: (isVisible: boolean) => void;
    isPaymentSheetLoading: boolean;
    setIsStripeFirstTierChoosePaymentMethodModalVisible: (isVisible: boolean) => void;
    setIsStripeSecondTierChoosePaymentMethodModalVisible: (isVisible: boolean) => void;
}

const LungeCoinsModal: React.FC<LungeCoinsModalProps> = (
    { isLungeCoinsModalVisible, setIsLungeCoinsModalVisible, isPaymentSheetLoading, setIsStripeFirstTierChoosePaymentMethodModalVisible, setIsStripeSecondTierChoosePaymentMethodModalVisible }
) => { 

    //const {t} = useTranslation();
    //const currentLanguage = i18next.language;

    const { iphoneModel, lungeCoinsAmount } = useContext(GlobalContext);

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isLungeCoinsModalVisible}
            onRequestClose={() => {
                setIsLungeCoinsModalVisible(!isLungeCoinsModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full h-[30%] rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium`}>
                            You've got <Text style={tw`text-xl font-semibold`}>{lungeCoinsAmount}</Text> Lunge Coin/s!
                        </Text>
  
                        <View style={tw`w-full h-[60%] flex justify-center flex-row gap-x-3 mt-3`}>
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-cyan-500 flex flex-col items-center justify-center`}
                                onPress={() => {
                                    setIsLungeCoinsModalVisible(false);
                                    setIsStripeFirstTierChoosePaymentMethodModalVisible(true);
                                }}
                            >

                                {!isPaymentSheetLoading ? 
                                    (<View style={tw`flex-col items-center justify-center`}>
                                        <Ionicons name='star-outline' size={32} color='white'/>
                                        <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-xl"} mt-2`}>Buy 10 Coins</Text>
                                        <Text style={tw`text-white font-bold ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-xl"} mt-[-2px]`}>1.99€</Text>
                                    </View>
                                    ) : 
                                    <ActivityIndicator size="large" color="white" />
                                }
                            </Pressable>
                            
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-rose-500 flex-col items-center justify-center`}
                                onPress={() => {
                                    setIsLungeCoinsModalVisible(false);
                                    setIsStripeSecondTierChoosePaymentMethodModalVisible(true);
                                }}
                            >
                                 {!isPaymentSheetLoading ? 
                                    (<View style={tw`flex-col items-center justify-center`}>
                                        <Ionicons name='sparkles-outline' size={32} color='white'/>
                                        <Text style={tw`text-white font-medium ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-xl"} mt-2`}>Buy 50 Coins</Text>
                                        <Text style={tw`text-white font-bold ${iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "text-lg" : "text-xl"} mt-[-2px]`}>6.99€</Text>
                                    </View>
                                    ) : 
                                    <ActivityIndicator size="large" color="white" />
                                }
                                
                            </Pressable>
                        </View>

                        <Pressable style={tw`mt-4 w-full h-12 flex items-center justify-center bg-gray-200 rounded-lg`} onPress={() => setIsLungeCoinsModalVisible(false)}>
                            <Text style={tw`text-xl font-medium`}>Go Back</Text>
                        </Pressable>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default LungeCoinsModal;