import { collection, doc, getDocs } from 'firebase/firestore';
import { FIREBASE_AUTH, FIRESTORE_DB } from '../../firebaseConfig';
import { Exercise, Workout, Set } from '../../interfaces';

const exportSavedWorkouts = async () => {
    const workouts = await getWorkouts();

    if (workouts.length === 0) {
        console.log("No saved workouts found.");
        return;
    }
    
    workouts.forEach(workout => {
        console.log(`Workout Title: ${workout.title} (ID: ${workout.id})`);
        workout.exercises.forEach(exercise => {
          console.log(`  Exercise Title: ${exercise.title} (ID: ${exercise.id})`);
          console.log(`  Description: ${exercise.description}`);
          console.log(`  Exercise Index: ${exercise.exerciseIndex}`);
          exercise.sets.forEach(set => {
            console.log(`    Set ID: ${set.id}`);
            console.log(`    Reps: ${set.reps}`);
            console.log(`    Weight: ${set.weight}`);
          });
        });
    });
    
}

const getWorkouts = async (): Promise<Workout[]> => {
    try {
      const usersCollectionRef = collection(FIRESTORE_DB, "users");
      const userDocRef = doc(usersCollectionRef, FIREBASE_AUTH.currentUser?.uid);
      const userSavedWorkoutsCollectionRef = collection(userDocRef, "saved_workouts");
  
      const querySnapshot = await getDocs(userSavedWorkoutsCollectionRef);
      const workouts: Workout[] = [];
  
      for (const workoutDoc of querySnapshot.docs) {
        const workoutData = workoutDoc.data();
        const workoutId = workoutDoc.id;
  
        const workout: Workout = {
          id: workoutId,
          title: workoutData.title,
          exercises: []
        };
  
        const exercisesCollectionRef = collection(workoutDoc.ref, "info");
        const exercisesSnapshot = await getDocs(exercisesCollectionRef);
  
        for (const exerciseDoc of exercisesSnapshot.docs) {
          const exerciseData = exerciseDoc.data();
          const exerciseId = exerciseDoc.id;
  
          const exercise: Exercise = {
            id: exerciseId,
            title: exerciseData.title,
            description: exerciseData.description,
            exerciseIndex: exerciseData.exerciseIndex,
            sets: []
          };
  
          const setsCollectionRef = collection(exerciseDoc.ref, "sets");
          const setsSnapshot = await getDocs(setsCollectionRef);
  
          for (const setDoc of setsSnapshot.docs) {
            const setData = setDoc.data();
            const setId = setDoc.id;
  
            const set: Set = {
              id: setId,
              reps: setData.reps,
              weight: setData.weight,
            };
  
            exercise.sets.push(set);
          }
  
          workout.exercises.push(exercise);
        }
  
        workouts.push(workout);
      }
  
      console.log("User's saved workouts with detailed info and sets:", workouts);
      return workouts;
    } catch (error) {
      console.error("Error fetching saved workouts:", error);
      return [];
    }
  };

export default exportSavedWorkouts