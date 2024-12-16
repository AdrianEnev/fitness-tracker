import { View, Text, Modal, Pressable, Keyboard, ActivityIndicator } from 'react-native'
import React, { useContext } from 'react'
import tw from 'twrnc'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useTranslation } from 'react-i18next';
import GlobalContext from '../../GlobalContext';

interface StripeFirstTierChoosePaymentMethodModalProps {
    isStripeFirstTierChoosePaymentMethodModalVisible: boolean;
    setIsStripeFirstTierChoosePaymentMethodModalVisible: (isVisible: boolean) => void;
    purchaseFirstTierCard: () => void;
    purchaseFirstTierApplePay: () => void;
    isPaymentSheetLoading: boolean;
    setIsStripeModalVisible: (isVisible: boolean) => void;
}

const StripeFirstTierChoosePaymentMethodModal: React.FC<StripeFirstTierChoosePaymentMethodModalProps> = ({ 
    isStripeFirstTierChoosePaymentMethodModalVisible, setIsStripeFirstTierChoosePaymentMethodModalVisible, purchaseFirstTierCard, purchaseFirstTierApplePay, isPaymentSheetLoading, setIsStripeModalVisible
}) => { 
    
    const {t} = useTranslation();

    const {iphoneModel} = useContext(GlobalContext);
    
    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={isStripeFirstTierChoosePaymentMethodModalVisible}
            onRequestClose={() => {
                setIsStripeFirstTierChoosePaymentMethodModalVisible(!isStripeFirstTierChoosePaymentMethodModalVisible);
            }}
            >
                <View style={tw`flex-1 justify-center items-center mx-3`}>
                    <Pressable style={tw`bg-white w-full ${iphoneModel.includes("SE") ? "h-[41.5%]" : iphoneModel.includes('Pro') || iphoneModel.includes('Plus') ? "h-[33%]" : "h-[31%]"} rounded-2xl pt-3 px-2`} onPress={Keyboard.dismiss}>

                        <Text style={tw`text-lg text-center font-medium mt-1`}>Choose Payment Method for <Text style={tw`font-bold text-xl`}>10</Text> Coins</Text>
                        <Text style={tw`text-lg text-center text-gray-500 font-medium mb-1`}>Please choose between Apple Pay or Card</Text>

                        <View style={tw`w-full h-[50%] flex justify-center flex-row gap-x-3 mt-1`}>
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-black flex flex-col items-center justify-center`}
                                onPress={() => {
                                    purchaseFirstTierApplePay();
                                }}
                            >

                                {!isPaymentSheetLoading ? 
                                    (<View style={tw`flex-col items-center justify-center flex-row`}>
                                        <Ionicons name='logo-apple' size={48} color='white'/>
                                        <Text style={tw`text-4xl font-medium text-white mt-2`}>Pay</Text>
                                        
                                    </View>
                                    ) : 
                                    <ActivityIndicator size="large" color="white" />
                                }
                            </Pressable>
                            
                            <Pressable style={tw`w-[48%] h-[100%] rounded-[20px] bg-rose-500 flex-col items-center justify-center`}
                                onPress={() => {
                                    purchaseFirstTierCard();
                                }}
                            >
                                 {!isPaymentSheetLoading ? 
                                    (<View style={tw`flex-col items-center justify-center flex-row`}>
                                        <Ionicons name='card-outline' size={48} color='white'/>
                                        <Text style={tw`text-4xl font-medium text-white mt-1 ml-1`}>Card</Text>
                                        
                                    </View>
                                    ) : 
                                    <ActivityIndicator size="large" color="white" />
                                }
                                
                            </Pressable>
                        </View>

                        <View style={tw`flex items-center mt-4`}>
                            <Pressable style={tw`bg-gray-200 w-full h-10 rounded-xl flex items-center justify-center`} onPress={() => {
                                setIsStripeFirstTierChoosePaymentMethodModalVisible(false)
                                setIsStripeModalVisible(true)
                            }}>
                                <Text style={tw`text-black text-lg font-medium`}>{t('back')}</Text>
                            </Pressable>
                        </View>
                        
                        
                    </Pressable>
                </View>
        </Modal>
    )
}

export default StripeFirstTierChoosePaymentMethodModal;