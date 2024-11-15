import { collection, doc, getDocs } from "firebase/firestore";
import { FIREBASE_AUTH, FIRESTORE_DB } from "../../firebaseConfig";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getEmail from "./useGetEmail";
import addWorkoutLocally from "../useWorkout/useAddWorkoutLocally";


const retreiveInfo = async (type: string, navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {

    if (internetSpeed < 50) {
        alert('Unstable internet connection, please try again later!');
        setIsRetreivingInfoAnimationModalVisible(false);
        return;
    }

    if (type == "workouts") {
        retreiveWorkouts(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
    }else if(type == "foods") {
        retreiveFoods(navigation, setIsRetreivingInfoAnimationModalVisible, internetSpeed);
    }

};

const retreiveFoods = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {
    
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

    if (foodDaysCountDB > foodDaysCountAS) {

        setIsRetreivingInfoAnimationModalVisible(true);

        const missingFoodDays = foodDaysSnapshot.docs.map(doc => doc.id).filter((foodDay: string) => {
            return !foodDayKeys.some((foodDayKey: string) => foodDayKey.includes(foodDay));
        });

        try{
            for (const foodDay of missingFoodDays) {

                if (internetSpeed < 50) {
                    alert('Unstable internet connection, please try again later!');
                    setIsRetreivingInfoAnimationModalVisible(false);
                    return;
                }

                const [year, month, day] = foodDay.split('-');
                const invertedFoodDay = `${year}-${month}-${day}`;
                
                // invertedFoodDay actually shows 15-11-2024, use that to form "email-foodDay-the date"
                const foodDayKey = `${email}-foodDay-${invertedFoodDay}`;
                const foodDayNutrientsKey = `${email}-foodDay-${invertedFoodDay}-nutrients`;

                

                setIsRetreivingInfoAnimationModalVisible(false);
            }

        }catch(err){
            console.error(err);
            alert('Error retreiving food day/s!');
        }
    }else{
        alert('No new food days to retreive!');
    }
    
}

const retreiveWorkouts = async (navigation: any, setIsRetreivingInfoAnimationModalVisible: any, internetSpeed: number) => {

    console.log('retreiveInfo');
    
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
                    alert('Unstable internet connection, please try again later!');
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
                setIsRetreivingInfoAnimationModalVisible(false);
    
                navigation.navigate('Тренировки');
            }

        }catch(err){
            console.error(err);
            alert('Error retreiving workout/s!');
        }
        
    }else{
        alert('No new workouts to retreive!');
    }



}

export default retreiveInfo;

function addFoodLocally(food: { id: string; }) {
        throw new Error("Function not implemented.");
    }
