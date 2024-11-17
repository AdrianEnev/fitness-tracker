import { View, Text, Pressable } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import tw from 'twrnc';
import { Picker } from 'react-native-wheel-pick';
import GlobalContext from '../../GlobalContext';

const SetupPageFour = ({ heightType, setHeightType, height, setHeight, setWeightType, setWeight, weight }: any) => {

    const [pickerData, setPickerData] = useState<number[]>([]);

    const [tempHeight, setTempHeight] = useState(170);

    const {iphoneModel} = useContext(GlobalContext);

    useEffect(() => {
        const data: number[] = [];
        for (let i = 120; i <= 220; i++) {
            data.push(i);
        }
        setPickerData(data);
    }, []); 
    
    const cmToFeetInches = (cm: any) => {
        const totalInches = cm * 0.393701;
        const feet = Math.floor(totalInches / 12);
        const inches = Math.round(totalInches % 12);
        return { feet, inches };
    };

    /*const feetInchesToCm = (feet: any, inches: any) => {
        return Math.round((feet * 12 + inches) * 2.54);
    };*/

    return (
        <View style={tw`flex flex-col ${iphoneModel.includes('pro') ? "mt-[10%]" : "mt-[15%]"} h-full`}>
            <View style={tw`mx-5`}>
                <Text style={tw`font-medium text-2xl text-center`}>Please enter your height.</Text>
                <Text style={tw`font-medium text-lg text-gray-500 mt-1 text-center`}>
                    This will <Text style={tw`font-bold`}>only</Text> be used to calculate your daily BMR!
                </Text>
            </View>

            <View style={tw`flex flex-row w-full mx-3 mt-[7%]`}>
                <Pressable
                    style={tw`w-[47.5%] h-14 border border-gray-300 rounded-l-[25px] flex items-center justify-center`}
                    onPress={() => {
                        if (heightType === "CM") {
                            return;
                        }

                        setHeightType('CM');
                        setHeight(tempHeight)
                        setWeightType('KG');
                        setWeight(Math.round(weight / 2.20462));
                    }}
                >
                    <Text style={tw`font-medium text-xl ${heightType === 'CM' ? 'text-[#fd3e4b]' : 'text-black'}`}>CM</Text>
                </Pressable>

                <Pressable
                    style={tw`w-[47.5%] h-14 border border-gray-300 rounded-r-[25px] flex items-center justify-center`}
                    onPress={() => {
                        if (heightType === "FT") {
                            return;
                        }
                        setHeightType('FT');
                        const convertedHeight = cmToFeetInches(height);
                        setHeight(convertedHeight);  // Set height as an object {feet, inches}
                        setWeightType('LB');
                        setWeight(Math.round(weight * 2.20462));
                    }}
                >
                    <Text style={tw`font-medium text-xl ${heightType === 'FT' ? 'text-[#fd3e4b]' : 'text-black'}`}>FT</Text>
                </Pressable>
            </View>

            <View style={tw`flex flex-row gap-x-1 justify-center mt-[7%]`}>
                {heightType === 'CM' ? (
                    <>
                        <Text style={tw`font-medium text-5xl`}>{height}</Text>
                        <Text style={tw`text-gray-500 text-xl font-medium mt-[12px]`}>cm</Text>
                    </>
                ) : (
                    <>
                        <Text style={tw`font-medium text-5xl`}>{height.feet}'</Text>
                        <Text style={tw`font-medium text-5xl`}>{height.inches}"</Text>
                    </>
                )}
            </View>

            <View style={tw`flex-1 items-center mt-[5%]`}>
                <View style={tw`w-[37%] h-[60%] bg-gray-200 rounded-[47px] flex items-center pt-3`}>
                    <Picker
                        style={tw`h-1/2 w-full bg-gray-200 rounded-[47px] mt-[50%]`}
                        selectedValue={height}
                        pickerData={pickerData}
                        onValueChange={(value: any) => { 
                            setHeight(value)
                            setTempHeight(value)
                        }}
                    />
                </View>
            </View>
        </View>
    );
};

export default SetupPageFour;
