//import { Workout } from "@config/interfaces";

const useGenerateWorkout = async (
    experienceLevel: any, 
    primaryGoal: any, 
    numberOfDays: any, 
    workoutLocation: any, 
    specificBodyparts: any, 
    equipment: any,
    language: any
) => {
    
    try {
        const response = await fetch(`http://localhost:3000/api/models/generateWorkout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                experienceLevel: experienceLevel,
                primaryGoal: primaryGoal,
                numberOfDays: numberOfDays,
                workoutLocation: workoutLocation,
                specificBodyparts: specificBodyparts,
                equipment: equipment,
                language: language
            }),
        });
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json();
        //return data as Workout;
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }


}
  
export default useGenerateWorkout;