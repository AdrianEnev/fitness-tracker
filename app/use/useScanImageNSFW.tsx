import { HfInference } from "@huggingface/inference";

const apiToken = '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';
const model = 'Falconsai/nsfw_image_detection';

const inference = new HfInference(apiToken);

const scanImage = async (blob: any) => {

    const result = await inference.imageClassification({
        model: model,
        data: blob
    });
    
    return result
}


export default scanImage;