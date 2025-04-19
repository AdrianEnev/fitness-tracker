import { FIREBASE_AUTH } from "@config/firebaseConfig"

const userId = FIREBASE_AUTH.currentUser?.uid

export const getLungeCoins = async () => {
    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/lungeCoins`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });
        if (!response.ok) {
            console.error("response ERROR, getting user lunge coins: ", response);
            return null;
        }

        const data = await response.json() as number;
        return data;
    } catch (error) {
        console.error("ERROR getting user lunge coins:", error);
        return null;
    }
}

export const decrementLungeCoins = async (amount: number) => {

    const params = new URLSearchParams({
        amount: amount.toString(),
   });

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/lungeCoins?${params.toString()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });
        if (!response.ok) {
            console.error("response ERROR decrementing lunge coins:", response);
            return null;
        }
    } catch (error) {
        console.error("ERROR decrementing lunge coins:", error);
        return null;
    }
}

export const addLungeCoins = async (amount: number) => {

    const params = new URLSearchParams({
        amount: amount.toString(),
   });

    try {
        const response = await fetch(`http://localhost:3000/api/users/${userId}/lungeCoins?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // Specifies the request body is JSON
            },
        });
        if (!response.ok) {
            console.error("response ERROR adding lunge coins:", response);
            return null;
        }
    } catch (error) {
        console.error("response ERROR adding lunge coins:", error);
        return null;
    }
}

