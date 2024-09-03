import { HfInference } from "@huggingface/inference";

const apiToken = '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';
const inference = new HfInference(apiToken);

const useGenerateWorkout = async (
    experienceLevel: any, primaryGoal: any, numberOfDays: any, workoutLocation: any, specificBodyparts: any, equipmentGroup: any, equipment: any
) => {

    

};

export default useGenerateWorkout;