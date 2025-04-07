const checkInternetSpeed = async () => {

    //console.log('checking internet speed...')

    const startTime = new Date().getTime();
    
    const response = await fetch('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png', {
        cache: 'no-store'
    });
    const endTime = new Date().getTime();

    const fileSize = 14 * 1024; // Assume the image size is ~14 KB
    const duration = (endTime - startTime) / 1000; // in seconds

    const speed = (fileSize / duration) / 1024; // in KBps
    //console.log(`Estimated Internet Speed: ${speed.toFixed(2)} KBps`);

    return speed;
}

export default checkInternetSpeed;
