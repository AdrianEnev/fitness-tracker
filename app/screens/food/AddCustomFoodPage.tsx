import { View, Text} from 'react-native'
import React, { useContext, useState } from 'react'
import tw from "twrnc"
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '@components/BottomNavigationBar';
import GlobalContext from '@config/GlobalContext';
import AddFoodNutrientsComponent from '@app/components/food/AddFoodNutrientsComponent';
import addFood from '@app/use/food/addFood';
import { formatDatePretty } from '@app/use/settings/change/useFormatDate';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const {internetConnected} = useContext(GlobalContext);

    const [name, setName] = useState(t('example-food'));
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    const [saveFoodRan, setSaveFoodRan] = useState(false)

    const saveFood = async () => {

        if (!name && saveFoodRan) {
            return;
        }

        setSaveFoodRan(true)

        // Create foodInfo object to pass for readability
        const foodInfo = {
            foodName: name.trim(),
            calories: calories,
            protein: protein,
            carbs: carbs,
            fat: fat,
            grams: grams
        }

        // Passed to addFood so it knows if the food is being added from the customFoodPage or searchFoodPage
        // Only used to determine where to navigate
        const isCustomFood = true
        
        // Add food to asyncstorage and firebase
        await addFood(date, foodInfo, internetConnected, navigation, isCustomFood);
        
    }

    return (
        <View style={tw`h-full w-full bg-white`}>
            
            <View style={tw`bg-gray-100 w-full h-[15%] flex justify-end`}>
                <Text style={tw`text-4xl font-medium text-black m-3`}>{t('add-food')}</Text>
            </View>

            <View style={tw`flex flex-row justify-between mx-4`}>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>{t('add-food-manually')}</Text>
                <Text style={tw`text-xl font-medium text-gray-500 mt-2`}>{formatDatePretty(date)}</Text>
            </View>

            <AddFoodNutrientsComponent
                calories={calories} 
                protein={protein} 
                carbs={carbs} 
                fat={fat} 
                setCalories={setCalories} 
                setProtein={setProtein} 
                setCarbs={setCarbs} 
                setFat={setFat}    
                name={name}
                setName={setName}        
                grams={grams}
                setGrams={setGrams} 
                translation={t}  
            />

            <BottomNavigationBar 
                currentPage='Add-Custom-Food' 
                navigation={navigation} 
                foodActions={{
                    addCustomFoodPageAddFood: saveFood
                }}
            />
            
        </View>
    )
}

export default AddCustomFoodPage