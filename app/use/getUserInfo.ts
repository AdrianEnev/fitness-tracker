import { UserInfo } from "../../interfaces";

const getUserInfo = async (userId: string) => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json() as UserInfo;
        //console.log(data)
        return data;

    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default getUserInfo;