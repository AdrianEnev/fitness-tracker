const generateRandomColour = () => {
    const colours = ["[#4ecdc4]", "[#ffd166]", "[#ff6b6b]"];
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
};

export default generateRandomColour;