import { View, Text, Modal, Pressable, Keyboard, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface StripeModalProps {
    isStripeModalVisible: boolean;
    setIsStripeModalVisible: (isVisible: boolean) => void;
    purchaseFirstTier: () => void;
    purchaseSecondTier: () => void;
    isPaymentSheetLoading: boolean;
}

const StripeModal: React.FC<StripeModalProps> = ({ 
    isStripeModalVisible, setIsStripeModalVisible, purchaseFirstTier, purchaseSecondTier, isPaymentSheetLoading
}) => { 
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isStripeModalVisible}
            onRequestClose={() => {
                setIsStripeModalVisible(!isStripeModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes("SE") ? "h-[41.5%]" : iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "h-[33%]" : "h-[31%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>{t('no-lunge-coins')}</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium mb-1`}>Generating a workout requires 1 Lunge Coin!</Text>

                        <View style={tw`w-full h-[50%] flex justify-center flex-row gap-x-3 mt-1`}>
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-cyan-500 flex flex-col items-center justify-center`}
                                onPress={() => {
                                    //setIsStripeModalVisible(false);
                                    purchaseFirstTier();
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
                                    //setIsStripeModalVisible(false);
                                    purchaseSecondTier();
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

                        <View style={tw`flex items-center mt-4`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => setIsStripeModalVisible(false)}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('back')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default StripeModal;