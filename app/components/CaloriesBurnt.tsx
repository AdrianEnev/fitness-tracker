import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {BarChart} from 'react-native-gifted-charts';
import { yAxisSides } from 'gifted-charts-core';
import tw from 'twrnc'

const CappedBars = () => {
    
    const getNumberOfWorkoutsForEachMonth = () => {
        return Math.floor(Math.random() * 100);
    }

    const data = [
        {value: Math.floor(Math.random() * 30), label: 'Jan', labelComponent: () => <Text>Jan</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Feb', labelComponent: () => <Text>Feb</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Mar', labelComponent: () => <Text>Mar</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Apr', labelComponent: () => <Text>Apr</Text>},
        {value: Math.floor(Math.random() * 30), label: 'May', labelComponent: () => <Text>May</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Jun', labelComponent: () => <Text>Jun</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Jul', labelComponent: () => <Text>Jul</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Aug', labelComponent: () => <Text>Aug</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Sep', labelComponent: () => <Text>Sep</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Oct', labelComponent: () => <Text>Oct</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Nov', labelComponent: () => <Text>Nov</Text>},
        {value: Math.floor(Math.random() * 30), label: 'Dec', labelComponent: () => <Text>Dec</Text>},
    ];

    const getScreenWidth = () => {
        return Math.round(Dimensions.get('window').width - 90);
    }

    return (
        <View style={tw`p-2`}>

            <Text style={tw`text-2xl font-medium text-black mb-2 ml-1`}>Number of workouts</Text>

            <BarChart
                data={data}
                barWidth={35}
                cappedBars
                capColor={'black'}
                capThickness={4}
                showGradient
                gradientColor={'#ef4444'}
                frontColor={'#fef2f2'}
                width={getScreenWidth()}
                yAxisSide={yAxisSides.LEFT}
            />
        </View>
    );
};

export default CappedBars;