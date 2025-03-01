import { collection, doc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "./useGetEmail";
import addRetrievedWorkoutLocally from "../useWorkout/useAddRetreivedWorkoutLocally";
import useAddRetreivedWorkoutLocally from "../useWorkout/useAddRetreivedSavedWorkoutLocally";

const retreiveInfo = async (type: string, navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number, t: any) => {

    console.log('running retreiveInfo');

    if (internetSpeed < 50) {
        console.log('bad internet connection')
        alert(t('unstable-connection'));
        setIsRetreivingInfoAnimationModalVisible(false);
        return;
    }

    console.log('internet connection - good')

    if (type == "workouts") {

        await retreiveWorkouts(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed, t);
        await retreiveSavedWorkouts(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed, t)

        //setIsRetreivingInfoAnimationModalVisible(false);
        //navigation.navigate('Тренировки');
        navigation.goBack();

        // optionally show pop up alerts - da izliza i che savenati i normalni sa vuzstanoveni
    }else if(type == "foods") {
        retreiveFoods(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed, t);
    }

};
const updateFood = async (foodDayKey: any, foodDaysCollectionRef: any) => {
    const storedData = await AsyncStorage.getItem(foodDayKey);
    const data = storedData ? JSON.parse(storedData) : [];

    const [email, foodDay, year, month, day] = foodDayKey.split('-');
    const formattedDate = `${year}-${month}-${day}`;
    const invertedFoodDayKey = `${email}-${foodDay}-${day}-${month}-${year}`;

    const foodDayDocRef = doc(foodDaysCollectionRef, formattedDate);
    const foodDayFoodsCollectionRef = collection(foodDayDocRef, 'foods');

    const foodDaySnapshot = await getDocs(foodDayFoodsCollectionRef);

    foodDaySnapshot.forEach(doc => {
        const foodData = doc.data();
        if (Object.keys(foodData).length > 0) {
            data.push(foodData);
        }
    });

    await AsyncStorage.setItem(invertedFoodDayKey, JSON.stringify(data));
};

// A slight problem to this implementation is that the number of workouts on the phone can be the same as the ones in the database, but the data inside the workouts can be different.
const retreiveFoods = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number, t: any) => {
    
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
            navigation.navigate('Хранене');

        } catch (err) {
            console.error(err);
            alert(t('error'));
        }
    } else {
        alert(t('all-foods-retreived'));
    }
    
}

const retreiveWorkouts = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number, t: any) => {
    
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
                        exerciseIndex: (exerciseData.exerciseIndex || 1) - 1
                    });
                }
            
                // Sort exercises by exerciseIndex
                exercises = exercises.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
            
                console.log('Missing Workout:', {
                    ...workout,
                    exercises
                });
            
                // Add missing workout to AsyncStorage
                await addRetrievedWorkoutLocally(exercises, workout.title, workout.id, workout.folderId);
            }

        }catch(err){
            console.error(err);
            alert(t('error'));
        }
    } else {
        alert(t('all-workouts-retreived'));
    }
}

const retreiveSavedWorkouts = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number, t: any) => {
    
    const usersCollectionRef = collection(FIRESTORE_DB, 'users');
    const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
    const savedWorkoutsCollectionRef = collection(userDocRef, 'saved_workouts');
    const savedWorkoutsSnapshot = await getDocs(savedWorkoutsCollectionRef);
    const savedWorkoutsCountDB = savedWorkoutsSnapshot.size;

    const email = await getEmail();
    const asyncStorageSavedWorkouts = await AsyncStorage.getItem(`savedWorkouts_${email}`);

    // get number of saved workouts in async storage
    const savedWorkoutsCountAS = asyncStorageSavedWorkouts ? JSON.parse(asyncStorageSavedWorkouts).length : 0;

    console.log('savedWorkoutsCountDB', savedWorkoutsCountDB);
    console.log('savedWorkoutsCountAS', savedWorkoutsCountAS);

    if (savedWorkoutsCountDB > savedWorkoutsCountAS) { 

        //setIsRetreivingInfoAnimationModalVisible(true);

        const savedWorkouts = savedWorkoutsSnapshot.docs.map(doc => ({ 
            id: doc.id, 
            title: doc.data().title, 
            created: doc.data().created, 
            duration: doc.data().duration, 
            ...doc.data() 
        }));

        const savedWorkoutsAS = asyncStorageSavedWorkouts ? JSON.parse(asyncStorageSavedWorkouts) : [];

        const missingSavedWorkouts = savedWorkouts.filter((savedWorkout: any) => {
            return !savedWorkoutsAS.some((savedWorkoutAS: any) => savedWorkoutAS.id === savedWorkout.id);
        });

        console.log('missingWorkouts', missingSavedWorkouts);

        try{
            for (const savedWorkout of missingSavedWorkouts) {

                if (internetSpeed < 50) {
                    alert(t('unstable-connection'));
                    setIsRetreivingInfoAnimationModalVisible(false);
                    return;
                }

                const savedWorkoutInfoCollectionRef = collection(savedWorkoutsCollectionRef, savedWorkout.id, 'info');
                const savedWorkoutInfoSnapshot = await getDocs(savedWorkoutInfoCollectionRef);
                let exercises = [];
            
                for (const exerciseDoc of savedWorkoutInfoSnapshot.docs) {
                    const exerciseData = exerciseDoc.data();
                    const setsCollectionRef = collection(savedWorkoutInfoCollectionRef, exerciseDoc.id, 'sets');
                    const setsSnapshot = await getDocs(setsCollectionRef);
                    let sets = setsSnapshot.docs.map(setDoc => setDoc.data());
            
                    // Sort sets by setIndex
                    sets = sets.sort((a, b) => a.setIndex - b.setIndex);
            
                    exercises.push({
                        id: exerciseDoc.id,
                        ...exerciseData,
                        sets,
                        exerciseIndex: (exerciseData.exerciseIndex || 1),
                        description: exerciseData.description,
                        note: exerciseData.note
                    });
                }
            
                // Sort exercises by exerciseIndex
                exercises = exercises.sort((a, b) => a.exerciseIndex - b.exerciseIndex);
            
                console.log('Missing Workout:', {
                    ...savedWorkout,
                    exercises
                });
            
                // add missing workout to asyncstorage
                useAddRetreivedWorkoutLocally(exercises, savedWorkout.title, savedWorkout.id, savedWorkout.duration);
            }
        }catch(err){
            console.error(err);
            alert(t('error'));
        }
    }

}

export default retreiveInfo;
