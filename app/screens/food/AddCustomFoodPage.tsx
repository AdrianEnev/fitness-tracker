import { View, Text} from 'react-native'
import React, { useContext, useState } from 'react'
import tw from "twrnc"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTranslation } from 'react-i18next';
import BottomNavigationBar from '@components/BottomNavigationBar';
import getEmail from '@use/settings/get/useGetEmail';
import GlobalContext from '@config/GlobalContext';
import { FIREBASE_AUTH } from '@config/firebaseConfig';
import generateID from '@use/settings/add/useGenerateID';
import AddFoodNutrientsComponent from '@screens/food/AddFoodNutrientsComponent';

const AddCustomFoodPage = ({navigation, route}: any) => {

    const { t } = useTranslation();

    const { date } = route.params;

    const {internetConnected, internetSpeed} = useContext(GlobalContext);

    const [name, setName] = useState(t('example-food'));
    const [calories, setCalories] = useState(0);
    const [protein, setProtein] = useState(0);
    const [carbs, setCarbs] = useState(0);
    const [fat, setFat] = useState(0);
    const [grams, setGrams] = useState(0);

    // Format date to work with the database
    const formatDate = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // Format date to be displayed to the user
    const formatDatePretty = (date: any) => {
        const year = date.year;
        const month = String(date.month).padStart(2, '0');
        const day = String(date.day).padStart(2, '0');
        return `${day}.${month}.${year}`;
    }

    const updateCurrentNutrients = async () => {

        try {
            const email = await getEmail();
            const storedData = await AsyncStorage.getItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}`);
            const data = storedData ? JSON.parse(storedData) : [];

            const formattedDate = formatDate(date);

            //console.log(`${email}-foodDay-${date.day}-${date.month}-${date.year}`)

            if (data.length === 0) {
                // foodDayCollectionRef is empty
                return;
            }

            let totalCalories = 0;
            let totalProtein = 0;
            let totalCarbs = 0;
            let totalFat = 0;

            data.forEach((food: any) => {
                totalCalories += food.calories || 0;
                totalProtein += food.protein || 0;
                totalCarbs += food.carbs || 0;
                totalFat += food.fat || 0;
            });

            const updatedNutrients = {
                calories: totalCalories,
                protein: totalProtein,
                carbs: totalCarbs,
                fat: totalFat
            };

            await AsyncStorage.setItem(`${email}-foodDay-${date.day}-${date.month}-${date.year}-nutrients`, JSON.stringify(updatedNutrients));

            // add to database in the background
            if (internetConnected && internetSpeed > 32) {

                const userId = FIREBASE_AUTH.currentUser?.uid;
                
                console.log('Attempting to update nutrients...')
                try {
                    const response = await fetch(`http://localhost:3000/api/foodDays/${userId}/${formattedDate}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json', 
                        },
                        body: JSON.stringify({
                            updatedNutrients: updatedNutrients
                        }),
                    });
                    if (!response.ok) {
                        console.error("error updating nutrients: ", response.statusText);
                        return null;
                    }
                } catch (error) {
                    console.error("error updating nutrients: ", error);
                    return null;
                }

                console.log('Nutrients successfuly updated!');

            }
        } catch (err) {
            console.error(err);
        }

    };

    const [saveFoodRan, setSaveFoodRan] = useState(false)

    const saveFood = async () => {

        if (!name && saveFoodRan) {
            return;
        }

        setSaveFoodRan(true)
    
        const email = await getEmail();
        const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
        console.log(foodDayKey)
        const storedData = await AsyncStorage.getItem(foodDayKey);
        const data = storedData ? JSON.parse(storedData) : [];

        const formattedDate = formatDate(date); // Example format: 2024-11-15

        let newCalories = Number(String(calories).replace(',', '.'));
        newCalories = Math.ceil(newCalories);
    
        let newProtein = Number(String(protein).replace(',', '.'));
        newProtein = Math.ceil(newProtein);
        
        let newCarbs = Number(String(carbs).replace(',', '.'));
        newCarbs = Math.ceil(newCarbs);
        
        let newFat = Number(String(fat).replace(',', '.'));
        newFat = Math.ceil(newFat);
        
        const documentInfo = {
            id: generateID(),
            title: name.trim(),
            date: new Date().toISOString(),
            calories: newCalories,
            protein: newProtein,
            carbs: newCarbs,
            fat: newFat,
            grams: Math.round(grams),
        };
    
        data.push(documentInfo);
        console.log("Adding item to async storage:", documentInfo);
        await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));
        
        navigation.goBack();

        if (internetConnected) {

            const userId = FIREBASE_AUTH.currentUser?.uid;
            
            console.log('Attempting to add food')
            try {
                const response = await fetch(`http://localhost:3000/api/foodDays/${userId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json', 
                    },
                    body: JSON.stringify({
                        itemInfo: documentInfo,
                        formattedDate: formattedDate
                    }),
                });
                
                //console.log('Response received: ', response);

                if (!response.ok) {
                    console.error("addFoodDay: error:", response.statusText);
                    return null;
                }

                // Update total nutrients for the day after adding food
                console.log('Food added, updating total nutrients')
                await updateCurrentNutrients();

            } catch (error) {
                console.error("addFoodDay: error:", error);
                return null;
            }
        }
        
    }

    return (
        <View style={tw`h-full w-full bg-white`}>
            
            <View style={tw`bg-gray-100 h-[15%] w-full flex justify-end`}>
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

            <BottomNavigationBar currentPage='AddCustomFoodPage' navigation={navigation} addCustomFoodPageAddFood={saveFood}/>
            
        </View>
    )
}

export default AddCustomFoodPage