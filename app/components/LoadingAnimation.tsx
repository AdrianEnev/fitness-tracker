import React from 'react'
import LottieView from 'lottie-react-native'

const LoadingAnimation = () => {
    return (
        <LottieView source={require('@assets/loading_animation.json')} autoPlay loop />
    )
}

export default LoadingAnimation