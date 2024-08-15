import { View, Text, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import {WebView} from 'react-native-webview';
import tw from 'twrnc'

const DonateScreen = () => {

    const paypalLink = 'https://paypal.me/plamenenev78'

    const [loading, setLoading] = useState(true)

    return (
        <View style={tw`flex-1`}>

            <WebView
                originWhitelist={['*']}
                source={{ uri: paypalLink }}
                style={tw`flex-1 ${!loading ? 'mt-1' : ''}`}
                onLoadEnd={() => setLoading(false)}
            />

            {loading && (
                <View style={tw`flex-1 items-center justify-center bg-white`}>
                    <ActivityIndicator size='large'/>
                </View>
            )}
        </View>
      );
}

export default DonateScreen