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
    ${equipment ? `The athlete will use ${equipment} equipment.` : 'The athelte has access to absolutely no equipment. You should include bodyweight exercises and stuff like "chair dips" or "door pull ups" alongside the popular exercises like push ups and bench dips depending on the level of the user. You can name push ups - "Push up variation" instead of "Push ups" if the user is a beginner meaning you can include easier variations of the exercise.'}
    I would like each exercise to have only 1 specific number of reps which would be the approximate number of reps for that exercise. 
    For example an exercise can have 8 reps as the value and not "8-12". 
    I also want you to keep in mind that "focusing on specific bodyparts" does not require focusing the whole program on those bodyparts but just slightly prioritizing them over other bodyparts during workouts.
    Also keep in mind that the main fitness goal set should not completely alter the focus of the workout plan but set the general direction.
    Only include exercises that can be done at ${workoutLocation} with ${equipment} equipment.
    Do not include exercises that require seconds instead of reps.
    Do not include any lesser known or gimicky exercises like "cable woodchoppers" and when generating unilateral exercises only return an integer value for the number of reps and not "10 per side" or something similar.
    Avoid pairing heavy/intence exercises in a single day. 
    For example if you have added a deadlift, you shouldn't then add a single-legged deadlift in the same workout. 
    The same goes for pairing deadlifts and squats. 
    For advanced-elite lifters, pairing those heavy compound exercises would only be acceptable if it's different exercises meaning you could pair squats 
    with deadlifts but not deadlifts with single legged deadlifts or squats with hack squats. If you do decide to pair squats with deadlifts in the same day 
    it should only be done for advanced to elite lifters and one of the lifts should be of lower intensity. Also keep in mind that pairing Squats + Deadlifts + Leg press is not a good combination as it involves too many compound lifts in one day. You can look at more popular splits and take inspiration from them.
    Each exercise should also include a weight value which should be a whole integer and not a range like "30-60kg" or "30 per side".         
    Another key thing is that you should avoid pairing leg exercises with other upper body exercises in workouts that are not full body days. For example, if the user prompt states that the workout split should be 4 days long, you should often choose to go with an upper lower, upper lower split (obviously not always, depending on the other user prompts). In that case you have already got 2 lower days so no leg exercises should be included in the upper days. 
    When it comes to 3 day splits, an upper, lower, full body split would make sense for many cases so then having 2 lower body days and only one upper body day means you should decrease the volume or intensity of one of the lower days if the user is a beginner to intermediate (the amount of volume/intensity decrease would depend on the level of the user).
    For advanced to elite lifters, full body 3 times a week is recommended, however volume/intensity should be managed accordinly as even for a long-time lifter, such split can have its problems.
    When generating a workout the name selection should be simpler but not as basic as "Day 1, Day 2, Day 3". A good name selection for 4 days would be something like "Upper 1, Lower 1, Upper 2, Lower 2" or something else depending on the selection you chose.
    Here is a list of popular splits that you should generate most of the time unless you feel that none of them are suited for the occasion: 
    {
      Suggestion 1: For beginners who are willing to train 5-7 times a week, you can consider a low intensity Bro split 40-50% of the time while for intermediates you could increase the volume but such Bro split should only be chosen 10-20% of the time with higher intensity/volume than beginners when it comes to intermediates. Elites and advanced lifters should never have that split generated,
      Suggestion 2: For lifters who are willing to go 4-6 times a week, you can consider a 4 day upper, lower split, an arnold split, a push pull legs split or a combination which you find most suiting. The intensity/volume should obviously be regulated depending on the level of the lifter,
      Suggestion 3: For lifters willing to go 3-4 times a week you should opt for an upper, lower split or upper, lower then full body. Regulating the intensity/volume here is crucial depending on the user experience as combining lots of lower days or lots of lower and upper days can have a huge effect in fatigue,
      Suggestion 4: For lifters willing to go twice a week you should do Upper, Lower for beginners and two full body days for intermediates and above,
      Suggestion 5: For lifters willing to go only once a week, a full body split is a must, 100% of the time
      Suggestion 6: You can combine various splits to make your own custom one. Do whatever you find most suiting for the prompts given by the user. Each split should contain empty days with the title "Rest Day" to fill in any days in the week that are rest days. Rest days should be spaced out as evenly as possible and in cases like a full push, pull legs split or anything similar, an 8 day week approach is recommended
      Suggestion 7: If the user prompt contains specific bodyparts like "Chest and back" that does not mean the whole program should revolve around those muscle groups. It means the workout should be normal with higher intensity or volume during the actual workouts, assigned to those specific bodyparts, or maybe an extra exercise or two per day for those muscle groups
    }
    As a last reminder, you should consult with other popular splits and articles about this topic to make the best split for the user according to their prompts. Take your time and throughly think about your selection before fully commiting to your answer.

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