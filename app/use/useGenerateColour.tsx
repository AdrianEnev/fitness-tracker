const generateRandomColour = (includeBG?: boolean) => {


    if (includeBG) {
        const colours = ['bg-[#fd3e54]', 'bg-[#3f8aff]', 'bg-[#15c48a]', 'bg-[#ffca2c]', 'bg-[#f053a3]', 'bg-[#9263fa]', 'bg-[#07c0da]'];
        const randomIndex = Math.floor(Math.random() * colours.length);
        return colours[randomIndex];
    } else{
        const colours = ['[#fd3e54]', '[#3f8aff]', '[#15c48a]', '[#ffca2c]', '[#f053a3]', '[#9263fa]', '[#07c0da]'];
        const randomIndex = Math.floor(Math.random() * colours.length);
        return colours[randomIndex];
    }
    
    
};

export default generateRandomColour;

/*
Red: #fd3e54
Blue: #3f8aff
Green: #15c48a
Yellow: #ffca2c
Pink: #f053a3
Purple: #9263fa
Cyan: #07c0da
*/

// darker red #fd1c47
// slightly less dark than #15c48a -> #0fbf8f