const generateRandomColour = () => {
    const colours = ['red-400', 'blue-400', 'green-400', 'yellow-400', 'indigo-400', 'pink-400', 'purple-400', 'cyan-400'];
    const randomIndex = Math.floor(Math.random() * colours.length);
    return colours[randomIndex];
};

export default generateRandomColour;