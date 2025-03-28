const checkImage = async (uri: any) => {

    try {
        const response = await fetch(`http://localhost:3000/api/global/checkImageNSFW/${uri}`);
        if (!response.ok) {
            console.error("Error fetching data:", response.statusText);
            return null;
        }

        const data = await response.json();
        const isImageNSFW = data.isImageNSFW
        return isImageNSFW;
    } catch (error) {
        console.error("Error fetching data:", error);
        return null;
    }
}

export default checkImage;