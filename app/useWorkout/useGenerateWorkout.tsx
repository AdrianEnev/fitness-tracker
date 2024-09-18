//import { HfInference } from "@huggingface/inference";

//const apiToken = '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';
//const inference = new HfInference(apiToken);



const useGenerateWorkout = async (
    experienceLevel: any, primaryGoal: any, numberOfDays: any, workoutLocation: any, specificBodyparts: any, equipmentGroup: any, equipment: any
) => {

    console.log('useGenerateWorkout called')

    const PAT = '50168f0b50684ef29f9d5c774f7833cd';

    const USER_ID = 'openai';    
    const APP_ID = 'chat-completion';

    const MODEL_ID = 'gpt-4-turbo';
    const MODEL_VERSION_ID = '182136408b4b4002a920fd500839f2c8'; 
    const RAW_TEXT = 'I want to generate a workout plan for a ' + experienceLevel + ' level athlete who wants to ' + primaryGoal + ' for ' + numberOfDays + ' days. The workout will take place at ' + workoutLocation + ' and will focus on ' + specificBodyparts + '. The athlete will use ' + equipment + ' equipment.';

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "text": {
                        "raw": RAW_TEXT
                        // url: TEXT_URL, allow_duplicate_url: true 
                        // raw: fileBytes
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };

    try {
        const response = await fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", requestOptions);
        const data = await response.json();
        if (data.status.code !== 10000) {
            console.log(data.status);
            return null
        } else {
            const workoutText = data.outputs[0].data.text.raw;
            // console.log(workoutText)
            return workoutText
        }
    } catch (error) {
        console.log('error', error);
    }

};

export default useGenerateWorkout;