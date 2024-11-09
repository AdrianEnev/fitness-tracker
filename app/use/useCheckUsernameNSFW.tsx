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
    } else if (!isUsernameInList(username.toLowerCase())) {
        return true;
    }
}

const isUsernameInList = async (username: string) => {

    const popularNames = new Set([
        "Liam", "Olivia", "Noah", "Emma", "Oliver", "Ava", "Elijah", "Charlotte", "James", "Sophia",
        "William", "Amelia", "Benjamin", "Isabella", "Lucas", "Mia", "Henry", "Evelyn", "Alexander", "Harper",
        "Mason", "Luna", "Michael", "Camila", "Ethan", "Gianna", "Daniel", "Abigail", "Jacob", "Ella",
        "Logan", "Elizabeth", "Jackson", "Sofia", "Sebastian", "Avery", "Jack", "Scarlett", "Aiden", "Emily",
        "Owen", "Aria", "Samuel", "Penelope", "Matthew", "Chloe", "Joseph", "Layla", "Levi", "Mila",
        "Mateo", "Nora", "David", "Hazel", "John", "Madison", "Wyatt", "Ellie", "Carter", "Lily",
        "Julian", "Nova", "Luke", "Isla", "Grayson", "Grace", "Isaac", "Violet", "Jayden", "Aurora",
        "Theodore", "Riley", "Gabriel", "Zoey", "Anthony", "Willow", "Dylan", "Emilia", "Leo", "Stella",
        "Lincoln", "Zoe", "Jaxon", "Victoria", "Asher", "Hannah", "Christopher", "Addison", "Josiah", "Leah",
        "Andrew", "Lucy", "Thomas", "Eliana", "Joshua", "Ivy", "Ezra", "Everly", "Adrian", "Alex", "Jordan"
    ]);

    return popularNames.has(username);
}

export default checkUsernameNSFW;