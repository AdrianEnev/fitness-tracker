import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import tw from 'twrnc';

const API_URL = 'http://172.20.10.5:3000/api/stripe';

const PaymentComponent = () => {

    const { initPaymentSheet, presentPaymentSheet } = useStripe();
    const [loading, setLoading] = useState(false);

    const fetchPaymentSheetParams = async () => {
		const response = await fetch(`${API_URL}/create-payment-intent`, {
			method: 'POST',
			headers: {
			'Content-Type': 'application/json',
			},
			body: JSON.stringify({ amount: 1 }),
		});
		const { paymentIntent, ephemeralKey, customer } = await response.json();
		return {
			paymentIntent,
			ephemeralKey,
			customer,
		};
    };

    const initializePaymentSheet = async () => {
		const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheetParams();

		const { error } = await initPaymentSheet({
			paymentIntentClientSecret: paymentIntent,
			customerEphemeralKeySecret: ephemeralKey,
			customerId: customer,
			merchantDisplayName: 'Lunge'
		});
		if (!error) {
			setLoading(true);
		}
    };

    const openPaymentSheet = async () => {
		const { error } = await presentPaymentSheet();

		if (error) {
			alert(`Error code: ${error.code}`);
		} else {
			alert('Success');
		}
    };

    return (
      <View style={tw`flex-1 justify-center items-center`}>
			<TouchableOpacity
			style={tw`w-[75%] h-[6.5%] bg-gray-700 rounded-[30px] shadow-lg flex items-center justify-center`}
			onPress={async () => {
				await initializePaymentSheet();
				await openPaymentSheet();
			}}
			disabled={!loading}
			>
				<Text style={tw`text-3xl font-semibold text-white`}>Pay $10</Text>
			</TouchableOpacity>
      </View>
    );
};

export default PaymentComponent;