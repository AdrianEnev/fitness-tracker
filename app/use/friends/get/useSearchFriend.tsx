
// Used to check if similar users exist anywhere in the database
// Ex: search - john -> results "john123", "john1234", "john12345" etc.
const searchForFriend = async (search: string) => {
    
    try {
        const response = await fetch(`http://172.20.10.5:3000/api/global/searchFriend?search=${search}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            }
        });
        if (!response.ok) {
            console.error("Error searching for friend:", response);
            return null;
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error searching for friend:", error);
        return null;
    }
}

export default searchForFriend;