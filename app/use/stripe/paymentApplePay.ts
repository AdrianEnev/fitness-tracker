import AsyncStorage from '@react-native-async-storage/async-storage';
import { confirmPlatformPayPayment } from '@stripe/stripe-react-native';
import { Alert } from 'react-native';
import { addLungeCoins } from '@useAddLungeCoins';

const API_URL = 'http://172.20.10.5:3000/api/stripe';

const fetchPaymentIntentClientSecret = async (price: number) => {

    const customerEmail = await AsyncStorage.getItem('email');

    const response = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: price,
            currency: 'eur',
            email: customerEmail,
        }),
    });

    if (!response.ok) {
        const errorText = await response.text();
        console.error('Error fetching payment intent:', errorText);
        throw new Error(`Error fetching payment intent: ${errorText}`);
    }

    const { clientSecret } = await response.json();
    return clientSecret;
};

export const payWithApplePay = async (price: number) => {
    try {
        const clientSecret = await fetchPaymentIntentClientSecret(price);
        const { error } = await confirmPlatformPayPayment(
            clientSecret,
            {
                applePay: {
                    cartItems: [
                        {
                            label: 'Lunge Coins',
                            amount: (price / 100).toFixed(2),
                            paymentType: 'Immediate' as any,
                        },
                        {
                            label: 'Total',
                            amount: (price / 100).toFixed(2),
                            paymentType: 'Immediate',
                        },
                    ],
                    merchantCountryCode: 'BG',
                    currencyCode: 'eur',
                },
            }
        );

        if (error) {
            if (error.code == "Canceled") {
                //setIsPaymentSheetShown(false);
                //setIsPaymentSheetLoading(false)
            } else {
                Alert.alert(`Error code: ${error.code}`, error.message);
            }
        } else {
            if (price == 199) {
                alert('Success! You have received 10 Lunge Coins!');
                await addLungeCoins(10);
            } else if (price == 699) {
                alert('Success! You have received 50 Lunge Coins!');
                await addLungeCoins(50);
            }
        }
    } catch (error: any) {

        if (error.includes('Network request failed')) {
            alert('Network request failed. Please check your internet connection and try again!');
            //return;
        }

        console.error('Error in payWithApplePay:', error);
    }
};