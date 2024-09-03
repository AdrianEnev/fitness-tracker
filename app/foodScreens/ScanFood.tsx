import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Image } from 'react-native';
import tw from 'twrnc';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);
    const [photo, setPhoto] = useState<any>(null);

    const takePicture = async () => {
        let options = {
            quality: 1,
            base64: true,
            exif: false,
        };

        let newPhoto = await cameraRef.current?.takePictureAsync(options);
        setPhoto(newPhoto);
    }

    if (!permission) {
        // Camera permissions are still loading.
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet.
        return (
            <View style={tw`flex-1 justify-center`}>
                <Text style={tw`text-center pb-2.5`}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    if (photo) {
        // Photo has been taken, show the photo
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Image source={{ uri: photo.uri }} style={tw`w-full h-full`} />
            </View>
        );
    }

    return (
        <View style={tw`flex-1 justify-center`}>
            <CameraView ref={cameraRef} style={tw`flex-1`} facing='back'>
                <View style={tw`flex-1 flex-row bg-transparent m-16`}>
                    <View style={tw`flex-1 justify-center items-center absolute inset-0`}>
                        <Ionicons name="scan-outline" size={300} color="white" />
                    </View>

                    <TouchableOpacity style={tw`flex-1 self-end items-center`} onPress={takePicture}>
                        <View style={tw`w-20 h-20 bg-white rounded-full border-4 border-gray-400 p-2 shadow-lg`}>
                            <View style={tw`w-full h-full bg-white rounded-full`} />
                        </View>
                    </TouchableOpacity>
                </View>
            </CameraView>
        </View>
    );
}