import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import tw from 'twrnc';
import ScanFoodModal from '../modals/ScanFoodModal';
import { BlurView } from 'expo-blur';
import scanImageNutrients from '../use/useScanImageNutrients';
import * as ImageManipulator from 'expo-image-manipulator';

export default function ScanFood({navigation, route}: any) {

    const { date } = route.params;

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);
    const [photo, setPhoto] = useState<any>(null);
    const [isScanFoodModalVisible, setIsScanFoodModalVisible] = useState(false);
    const [isCameraFrozen, setIsCameraFrozen] = useState(false);

    const takePicture = async () => {

        setIsCameraFrozen(true);
        setIsScanFoodModalVisible(true);

        let options = {
            quality: 1, // Highest quality
            base64: true,
            exif: true, // Include EXIF data
            skipProcessing: false // Skip additional processing for faster capture
        };

        let newPhoto = await cameraRef.current?.takePictureAsync(options);
        setPhoto(newPhoto);

        // Crop photo - same as in the scan-outline icon immitation
        const cropWidth = 1400; 
        const cropHeight = 1400;
        const cropX = (newPhoto.width - cropWidth) / 2;
        const cropY = (newPhoto.height - cropHeight) / 2;

        const croppedPhoto = await ImageManipulator.manipulateAsync(
            newPhoto.uri,
            [{ crop: { originX: cropX, originY: cropY, width: cropWidth, height: cropHeight } }],
            { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
        );

        await scanImageNutrients(croppedPhoto, date)
        navigation.goBack();

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

    /*if (photo) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Image source={{ uri: photo.uri }} style={{ width: 320, height: 320 }} />
            </View>
        );
    }*/

    return (
        <>

            { isScanFoodModalVisible && (
                <BlurView
                    style={tw`absolute w-full h-full z-10`}
                    intensity={50}
                    tint='dark'
                />
            )}

            <ScanFoodModal
                isScanFoodModalVisible={isScanFoodModalVisible}
                setIsScanFoodModalVisible={setIsScanFoodModalVisible}
                photo={photo}
            />

            <View style={tw`flex-1 justify-center`}>
                {isCameraFrozen && photo ? (
                    <Image source={{ uri: photo.uri }} style={tw`flex-1`} />
                ) : (
                    <CameraView ref={cameraRef} style={tw`flex-1`} facing='back'>
                        <View style={tw`flex-1 flex-row bg-transparent m-16`}>
                            <View style={tw`flex-1 justify-center items-center absolute inset-0`}>
                                <View style={tw`w-80 h-80`}>
                                    <View style={tw`absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-white rounded-tl-lg`} />
                                    <View style={tw`absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-white rounded-tr-lg`} />
                                    <View style={tw`absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-white rounded-bl-lg`} />
                                    <View style={tw`absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-white rounded-br-lg`} />
                                </View>
                            </View>

                            <TouchableOpacity style={tw`flex-1 self-end items-center`} onPress={takePicture}>
                                <View style={tw`w-20 h-20 bg-white rounded-full border-4 border-gray-400 p-2 shadow-lg`}>
                                    <View style={tw`w-full h-full bg-white rounded-full`} />
                                </View>
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                )}
            </View>
        </>
    );
}