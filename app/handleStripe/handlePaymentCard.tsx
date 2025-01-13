import AsyncStorage from "@react-native-async-storage/async-storage";
import { presentPaymentSheet } from "@stripe/stripe-react-native";
import { Alert } from "react-native";
import { addLungeCoins } from "../use/useAddLungeCoins";

export const initializePaymentSheet = async (initPaymentSheet: any, price: number) => {

    console.log('initializePaymentSheet ran');

    const userDeviceEmail = await AsyncStorage.getItem('email');
    const trimmedEmail = userDeviceEmail ? userDeviceEmail.split('@')[0] : '';

    try {
        const {
            paymentIntent,
            ephemeralKey,
            customer,
        } = await fetchPaymentSheetParams(price);
        console.log('Fetched payment sheet params:', { paymentIntent, ephemeralKey, customer });

        const { error } = await initPaymentSheet({
            merchantDisplayName: "Adrian Enev",
            customerId: customer,
            customerEphemeralKeySecret: ephemeralKey,
            paymentIntentClientSecret: paymentIntent,
            defaultBillingDetails: {
                name: trimmedEmail,
            },
            returnURL: 'lunge-fitness-tracker://payment-return',
        });

        if (!error) {
            console.log('initialized successfully');
            //setReady(true);
        } else {
            console.log('Error initializing payment sheet:', error);
        }
    } catch (error) {
        console.log('Error in initializePaymentSheet:', error);
    }
};

const API_URL = 'https://fitness-tracker-0mda.onrender.com';

const fetchPaymentSheetParams = async (price: number) => {
    
    const customerEmail = await AsyncStorage.getItem('email');

    // Fetch or create the customer
    const customerResponse = await fetch(`${API_URL}/create-or-retrieve-customer`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: customerEmail }),
    });

    if (!customerResponse.ok) {
        const errorText = await customerResponse.text();
        console.error('Error fetching customer:', errorText);
        throw new Error(`Error fetching customer: ${errorText}`);
    }

    const { customerId } = await customerResponse.json();

    const paymentIntentResponse = await fetch(`${API_URL}/create-payment-intent`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            amount: price,
            currency: 'eur',
            customerId,
        }),
    });

    if (!paymentIntentResponse.ok) {
        const errorText = await paymentIntentResponse.text();
        console.error('Error fetching payment intent:', errorText);
        throw new Error(`Error fetching payment intent: ${errorText}`);
    }

    const paymentIntentData = await paymentIntentResponse.json();

    const ephemeralKeyResponse = await fetch(`${API_URL}/create-ephemeral-key`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerId }),
    });

    if (!ephemeralKeyResponse.ok) {
        const errorText = await ephemeralKeyResponse.text();
        console.error('Error fetching ephemeral key:', errorText);
        throw new Error(`Error fetching ephemeral key: ${errorText}`);
    }

    const ephemeralKeyData = await ephemeralKeyResponse.json();

    return {
        paymentIntent: paymentIntentData.clientSecret,
        ephemeralKey: ephemeralKeyData.secret,
        customer: customerId,
    };
};

export const buy = async (setIsPaymentSheetShown: any, setIsPaymentSheetLoading: any, price: number) => {
    const {error} = await presentPaymentSheet();

    if (error) {
        if (error.code == "Canceled") {
            setIsPaymentSheetShown(false);
            setIsPaymentSheetLoading(false)
        } else {
            Alert.alert(`Error code: ${error.code}`, error.message);
        }
    } else {
        if (price == 199) {
            alert('Success! You have received 10 Lunge Coins!')
            await addLungeCoins(10);
        } else if (price == 699) {
            alert('Success! You have received 50 Lunge Coins!')
            await addLungeCoins(50);
        }
    }
}