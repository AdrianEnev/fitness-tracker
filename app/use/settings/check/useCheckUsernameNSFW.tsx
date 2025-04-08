const checkUsernameNSFW = async (username: string) => {

    try {
        const response = await fetch(`http://localhost:3000/api/models/checkUsernameNSFW/${username}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json();
        const isUsernameNSFW = data.isUsernameNSFW;
        return isUsernameNSFW;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }

}

export default checkUsernameNSFW;