const apiToken = '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';

const checkUsernameNSFW = async (username: string) => {

    const response = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-mnli", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${apiToken}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
            inputs: username,
            parameters: {
                candidate_labels: ["offensive", "non-offensive"] 
            }
        })
    });    

    const data = await response.json();

    // ako mahan console log, ne iska da raboti prostotiqta tui che go ostavqm
    console.log(data)
    
    if (data.labels[0] == "non-offensive") {
        return false;
    } else {
        return true;
    }
}

export default checkUsernameNSFW;