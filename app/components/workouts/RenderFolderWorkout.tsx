import { Workout } from "@config/interfaces";
import React from "react";
import { Pressable, View, Text } from "react-native";
import tw from 'twrnc';
import Ionicons from '@expo/vector-icons/Ionicons';
import getInitials from "@app/use/settings/useGetInitials";

interface RenderFolderWorkoutProps {
    item: Workout;
    selectedWorkouts: any;
    viewWorkoutButtonDisabled: any;
    setSelectedWorkouts: React.Dispatch<React.SetStateAction<any[]>>;
    setSelectionMode: React.Dispatch<React.SetStateAction<boolean>>;
    selectionMode: boolean;
    viewWorkout: (workout: Workout) => void;
    t: any;
}

const RenderFolderWorkout = (
    { 
        item: workout, 
        selectedWorkouts, 
        viewWorkoutButtonDisabled, 
        setSelectedWorkouts, 
        setSelectionMode, 
        selectionMode, 
        viewWorkout, 
        t 
    }: RenderFolderWorkoutProps
) => {
    if (workout.title.includes("Rest~+!_@)#($*&^@&$^*@^$&@*$&#@&#@(&#$@*&($")) {
        return (
            <Pressable style={tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3
                ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'}
            `}
                onLongPress={() => {
                    if (selectedWorkouts.length === 0) {
                        setSelectedWorkouts([...selectedWorkouts, workout]);
                        setSelectionMode(true);
                    }
                }}
                onPress={() => {
                    if (selectionMode) {
                        setSelectedWorkouts((prevSelectedWorkouts: any) => {
                            if (prevSelectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)) {
                                return prevSelectedWorkouts.filter((selectedWorkout: any) => selectedWorkout.id !== workout.id);
                            } else {
                                return [...prevSelectedWorkouts, workout];
                            }
                        });
                    }
                }}
            >
                <View style={tw`flex flex-row justify-between`}>
                    <View style={tw`flex-1 flex-row`}>
                        <View style={tw`h-full py-3`}>
                            <View style={tw`w-14 h-full rounded-md bg-[#67e8f9] flex items-center justify-center`}>
                                <Ionicons name='cloud' size={38} color='white' />
                            </View>
                        </View>

                        <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                            <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>
                                {t('rest-day')}
                            </Text>

                            <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{t('you-can-take-a-break-today')}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        );
    } else {
        return (
            <Pressable style={tw`w-full h-24 bg-white border border-gray-200 shadow-sm rounded-2xl mr-2 mb-2 py-2 px-3
                ${selectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id) ? 'border-2 border-red-300' : 'border border-gray-200'}
                `}
                key={workout.id} disabled={viewWorkoutButtonDisabled}
                onPress={() => {
                    if (!selectionMode) {
                        viewWorkout(workout);
                    } else {
                        setSelectedWorkouts((prevSelectedWorkouts: any) => {
                            if (prevSelectedWorkouts.some((selectedWorkout: any) => selectedWorkout.id === workout.id)) {
                                return prevSelectedWorkouts.filter((selectedWorkout: any) => selectedWorkout.id !== workout.id);
                            } else {
                                return [...prevSelectedWorkouts, workout];
                            }
                        });
                    }
                }}
                onLongPress={() => {
                    if (selectedWorkouts.length === 0) {
                        console.log('selection mode on');
                        setSelectedWorkouts([...selectedWorkouts, workout]);
                        setSelectionMode(true);
                    }
                }}
            >
                <View style={tw`flex flex-row justify-between`}>
                    <View style={tw`flex-1 flex-row`}>
                        <View style={tw`h-full py-3`}>
                            <View style={tw`w-14 h-full rounded-md bg-${workout.colour} flex items-center justify-center`}>
                                <Text style={tw`text-xl font-medium text-white`}>{workout.previousTitle ? getInitials(workout.previousTitle) : getInitials(workout.title)}</Text>
                            </View>
                        </View>

                        <View style={tw`flex flex-col ml-3 justify-center w-full`}>
                            <Text style={tw`text-xl font-medium w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>
                                {workout.title}
                            </Text>

                            <Text style={tw`text-lg font-medium text-gray-500 w-[80%]`} ellipsizeMode='tail' numberOfLines={1}>{workout.numberOfExercises} {workout.numberOfExercises === 1 ? t('exercise') : t('exercises')}</Text>
                        </View>
                    </View>

                    <View style={tw`flex justify-center`}>
                        <Ionicons name='chevron-forward' size={36} color='#9ca3af' />
                    </View>
                </View>
            </Pressable>
        );
    }
};

export default RenderFolderWorkout;