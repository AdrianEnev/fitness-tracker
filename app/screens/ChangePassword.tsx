import { View, Text, TouchableWithoutFeedback, SafeAreaView, KeyboardAvoidingView, Keyboard, TextInput, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import tw from "twrnc";
import { FIREBASE_AUTH } from '../../firebaseConfig';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

const ChangePassword = () => {

    const [email, setEmail] = useState('');

    const changePassword = () => {

        if (email.length <= 0) {    
            return;
        }

        sendPasswordResetEmail(getAuth(), email)
        .then(() => {
            alert('Email sent successfuly!');
        })
        .catch((error) => {
            alert(error.message);
        });
    }

    return (
      <SafeAreaView style={tw`mx-5 flex-1`}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
              <View style={tw`flex-1`}>

                  <Text style={tw`text-base text-center font-medium mt-2`}>ENV: Fitness Tracker</Text>

                  <KeyboardAvoidingView behavior='padding'>
                      
                      <View style={tw`flex-col gap-y-2 my-5`}>
                          <TextInput style={tw`bg-white h-10 pl-2 rounded-lg`} placeholder="Email" onChangeText={(text: string) => setEmail(text)} value={email} autoCapitalize='none'/>

                          <TouchableOpacity style={tw`w-full h-14 bg-[#fd1c47] rounded-2xl flex justify-center items-center shadow-md mt-1`}
                          onPress={changePassword}>
                              <Text style={tw`text-2xl text-white`}>Изпрати </Text>
                          </TouchableOpacity>
                              
                      </View>
                  
                  </KeyboardAvoidingView>
              </View>
          </TouchableWithoutFeedback>
      </SafeAreaView>
    )
}

export default ChangePassword