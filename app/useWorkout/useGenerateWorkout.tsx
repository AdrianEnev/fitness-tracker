const useGenerateWorkout = async (
    experienceLevel: any, primaryGoal: any, numberOfDays: any, workoutLocation: any, specificBodyparts: any, equipmentGroup: any, equipment: any
) => {

    console.log('useGenerateWorkout called')

    const PAT = '50168f0b50684ef29f9d5c774f7833cd';

    const USER_ID = 'openai';    
    const APP_ID = 'chat-completion';

    const MODEL_ID = 'gpt-4-turbo';
    const MODEL_VERSION_ID = '182136408b4b4002a920fd500839f2c8'; 
    const RAW_TEXT = `
    Generate a workout plan for a ${experienceLevel} level athlete who wants to ${primaryGoal} for ${numberOfDays} days. 
    The workout will take place at ${workoutLocation} and will focus on ${specificBodyparts}. 
    The athlete will use ${equipment} equipment. 
    I would like each exercise to have only 1 specific number of reps which would be the approximate number of reps for that exercise. 
    For example an exercise can have 8 reps as the value and not "8-12". 
    I also want you to keep in mind that "focusing on specific bodyparts" does not require focusing the whole program on those bodyparts but just slightly prioritizing them over other bodyparts during workouts.
    Also keep in mind that the main fitness goal set should not completely alter the focus of the workout plan but set the general direction.
    Only include exercises that can be done at ${workoutLocation} with ${equipment} equipment.
    Do not include exercises that require seconds instead of reps.
    Do not include any lesser know or gimicky exercises like "cable woodchoppers" and when generating unilateral exercises only return an integer value for the number of reps and not "10 per side" or something similar.

    Please provide the workout plan in the following JSON format:
    {
      "days": [
        {
          "day": "Day 1",
          "exercises": [
            {
              "name": "Exercise 1",
              "sets": 3,
              "reps": 12
            },
            {
              "name": "Exercise 2",
              "sets": 3,
              "reps": 10
            }
          ]
        },
        {
          "day": "Day 2",
          "exercises": [
            {
              "name": "Exercise 3",
              "sets": 4,
              "reps": 8
            }
          ]
        }
      ]
    }
    `;

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
        const responseText = await response.text(); // Get raw response text
        console.log('Raw response:', responseText); // Log raw response
        const data = JSON.parse(responseText); // Attempt to parse JSON
    
        if (data.status.code !== 10000) {
            console.log(data.status);
            return null;
        } else {
            // Extract the embedded JSON string
            const embeddedJsonString = data.outputs[0].data.text.raw;
            // Remove the triple backticks and parse the JSON string
            const cleanedJsonString = embeddedJsonString.replace(/```json|```/g, '').trim();
            // Remove invalid characters
            const validJsonString = cleanedJsonString.replace(/ per leg| per set for distance or time/g, '');
            // Extract only the JSON part
            const jsonStartIndex = validJsonString.indexOf('{');
            const jsonEndIndex = validJsonString.lastIndexOf('}') + 1;
            const jsonString = validJsonString.substring(jsonStartIndex, jsonEndIndex);
            console.log('Extracted JSON string:', jsonString); // Log extracted JSON string
            const workoutPlan = JSON.parse(jsonString);
            return workoutPlan;
        }
    } catch (error) {
        console.log('error', error);
    }

};

export default useGenerateWorkout;