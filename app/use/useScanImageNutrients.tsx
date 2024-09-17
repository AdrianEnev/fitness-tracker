import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import getEmail from './useGetEmail';
import { Platform } from 'react-native';
import * as FileSystem from 'expo-file-system';

const scanImageNutrients = async (image: any, date: any) => {
    const PAT = '50168f0b50684ef29f9d5c774f7833cd';
    const USER_ID = 'clarifai';
    const APP_ID = 'main';
    const MODEL_ID = 'food-item-recognition';
    const MODEL_VERSION_ID = '1d5fd481e0cf4826aa72ec3ff049e044';

    try {
        // Read the image file and convert it to base64
        const base64Image = await FileSystem.readAsStringAsync(image.uri, {
            encoding: FileSystem.EncodingType.Base64,
        });

        const raw = JSON.stringify({
            "user_app_id": {
                "user_id": USER_ID,
                "app_id": APP_ID
            },
            "inputs": [
                {
                    "data": {
                        "image": {
                            "base64": base64Image
                        }
                    }
                }
            ]
        });

        const requestOptions = {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Key ' + PAT,
                'Content-Type': 'application/json'
            },
            body: raw
        };

        const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
        const result = await response.json();

        if (result.status.code === 10000) {
            const concepts = result.outputs[0].data.concepts;
            
            const highestConfidence = concepts.reduce((prev: any, current: any) => (prev.value > current.value) ? prev : current);
            console.log('Highest confidence:', highestConfidence);
            
            ///await addFoodToAsyncStorage(date, concepts);
        } else {
            console.error('Error in Clarifai response:', result.status.description);
        }
    } catch (error) {
        console.error('Image processing failed:', error);
    }
}

const addFoodToAsyncStorage = async (date: any, foodData: any) => {
    const email = await getEmail();
    const foodDayKey = `${email}-foodDay-${date.day}-${date.month}-${date.year}`;
    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    foodData.forEach((foodItem: any) => {
        const documentInfo = {
            title: foodItem.name,
            date: new Date().toISOString(),
            confidence: foodItem.value
        };

        data.push(documentInfo);
    });

    await AsyncStorage.setItem(foodDayKey, JSON.stringify(data));
}

export default scanImageNutrients;