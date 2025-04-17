const deleteFood = async (item: any, formattedDate: any, updatedNutrients: any, userId: string) => {
            
    try {
        const response = await fetch(`http://172.20.10.5:3000/api/foodDays/${userId}/${formattedDate}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json', 
            },
            body: JSON.stringify({
                item: item,
                updatedNutrients: updatedNutrients
            }),
        });
        if (!response.ok) {
            console.error("deleteFoodDay: error:", response.statusText);
            return null;
        }

    } catch (error) {
        console.error("deleteFoodDay: error:", error);
        return null;
    }
}

export default deleteFood;