import { collection, doc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "./useGetEmail";
import addWorkoutLocally from "../useWorkout/useAddWorkoutLocally";
import { useTranslation } from "react-i18next";

const retreiveInfo = async (type: string, navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {

    const {t} = useTranslation();

    if (internetSpeed < 50) {
        alert(t('unstable-connection'));
        setIsRetreivingInfoAnimationModalVisible(false);
        return;
    }

    if (type == "workouts") {
        retreiveWorkouts(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
    }else if(type == "foods") {
        retreiveFoods(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
    }

};
const updateFood = async (foodDayKey: any, foodDaysCollectionRef: any) => {

    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    const [email, foodDay, year, month, day] = foodDayKey.split('-');
    //const formattedDate = `${year}-${month}-${day}`;
    const formattedDate = `${year}-${month}-${day}`;
    const invertedFoodDayKey = `${email}-${foodDay}-${day}-${month}-${year}`

    const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);
    const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');

    const foodDaySnapshot = await getDocs(foodDayFoodsCollectionRef);

    foodDaySnapshot.forEach(doc => {
        const foodData = doc.data();
        data.push(foodData);
    });

    await AsyncStorage.setItem(invertedFoodDayKey, JSON.stringify(data));

};

// A slight problem to this implementation is that the number of workouts on the phone can be the same as the ones in the database, but the data inside the workouts can be different.
const retreiveFoods = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {

    const {t} = useTranslation();
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const foodDaysCollectionRef = collection(userDocRef, 'food_days');

    const foodDaysSnapshot = await getDocs(foodDaysCollectionRef);
    const foodDaysCountDB = foodDaysSnapshot.size;

    const email = await getEmail();
    
    const keys = await AsyncStorage.getAllKeys();
    const foodDayKeys = keys.filter((key: string) => key.includes(`${email}-foodDay`) && !key.includes('nutrients'));
    const foodDaysCountAS = foodDayKeys.length;

    console.log('foodDaysCountDB', foodDaysCountDB);
    console.log('foodDaysCountAS', foodDaysCountAS);

    console.log(foodDayKeys)

    if (foodDaysCountDB > foodDaysCountAS) {
        setIsRetreivingInfoAnimationModalVisible(true);

        const missingFoodDays = foodDaysSnapshot.docs.map(doc => doc.id).filter((foodDay: string) => {
            return !foodDayKeys.some((foodDayKey: string) => foodDayKey.includes(foodDay));
        });

        try {
            for (const foodDay of missingFoodDays) {
                if (internetSpeed < 50) {
                    alert(t('unstable-connection'));
                    setIsRetreivingInfoAnimationModalVisible(false);
                    return;
                }

                const foodDayKey = `${email}-foodDay-${foodDay}`;
                await updateFood(foodDayKey, foodDaysCollectionRef);

            }

            setIsRetreivingInfoAnimationModalVisible(false);
            navigation.navigate('Храна');

        } catch (err) {
            console.error(err);
            alert(t('error'));
        }
    } else {
        alert(t('all-foods-retreived'));
    }
    
}

const retreiveWorkouts = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {

    const {t} = useTranslation();
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const workoutsCollectionRef = collection(userDocRef, 'workouts');
    const workoutsSnapshot = await getDocs(workoutsCollectionRef);

    // get number of documents inside the workouts collection
    const workoutsCountDB = workoutsSnapshot.size;

    const email = await getEmail();
    const asyncStorageWorkouts = await AsyncStorage.getItem(`workouts_${email}`);

    // get number of workouts in async storage
    const workoutsCountAS = asyncStorageWorkouts ? JSON.parse(asyncStorageWorkouts).length : 0;

    console.log('workoutsCountDB', workoutsCountDB);
    console.log('workoutsCountAS', workoutsCountAS);

    if (workoutsCountDB > workoutsCountAS) { 

        setIsRetreivingInfoAnimationModalVisible(true);

        // compare workout ids and anything missing in asyncstorage should be console logged
        const workouts = workoutsSnapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title, folderId: doc.data().folderId, ...doc.data() }));
        const workoutsAS = asyncStorageWorkouts ? JSON.parse(asyncStorageWorkouts) : [];

        const missingWorkouts = workouts.filter((workout: any) => {
            return !workoutsAS.some((workoutAS: any) => workoutAS.id === workout.id);
        });
        
        try{

            for (const workout of missingWorkouts) {

                if (internetSpeed < 50) {
                    alert(t('unstable-connection'));
                    setIsRetreivingInfoAnimationModalVisible(false);
                    return;
                }

                const workoutInfoCollectionRef = collection(workoutsCollectionRef, workout.id, 'info');
                const workoutInfoSnapshot = await getDocs(workoutInfoCollectionRef);
                let exercises = [];
            
                for (const exerciseDoc of workoutInfoSnapshot.docs) {
                    const exerciseData = exerciseDoc.data();
                    const setsCollectionRef = collection(workoutInfoCollectionRef, exerciseDoc.id, 'sets');
                    const setsSnapshot = await getDocs(setsCollectionRef);
                    let sets = setsSnapshot.docs.map(setDoc => setDoc.data());
            
                    // Sort sets by setIndex
                    sets = sets.sort((a, b) => a.setIndex - b.setIndex);
            
                    exercises.push({
                        id: exerciseDoc.id,
                        ...exerciseData,
                        sets,
                        exerciseIndex: (exerciseData.exerciseIndex || 1) - 1 // Decrement exerciseIndex by 1
                    });
                }
            
                // Sort exercises by exerciseIndex
                exercises = exercises.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
            
                console.log('Missing Workout:', {
                    ...workout,
                    exercises
                });
            
                // Add missing workout to AsyncStorage
                await addWorkoutLocally(exercises, workout.title, workout.id, workout.folderId);
            }

            setIsRetreivingInfoAnimationModalVisible(false);
            navigation.navigate('Тренировки');

        }catch(err){
            console.error(err);
            alert(t('error'));
        }
    } else {
        alert(t('all-workouts-retreived'));
    }
}

export default retreiveInfo;
