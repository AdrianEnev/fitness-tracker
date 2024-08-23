import {HfInference} from "@huggingface/inference";

const apiToken = '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';
//const model = 'meta-llama/Meta-Llama-3.1-8B-Instruct'; -> costs pro subscription, uncomment when needed
const model = 'microsoft/Phi-3.5-mini-instruct';

const inference = new HfInference(apiToken);

const useGenerateWorkout = async () => {
    try {

        console.log('Generating text...');
        const result = await inference.textGeneration({
            model: model,
            inputs: 'Hello',
            
        });

        console.log(result);
    } catch (error) {
        console.error('Error generating text:', error);
    }
};

export default useGenerateWorkout;