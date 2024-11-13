import { CameraView, CameraType, useCameraPermissions, Camera } from 'expo-camera';
import { useEffect, useRef, useState } from 'react';
import { Button, Text, TouchableOpacity, View, Image, Modal } from 'react-native';
import tw from 'twrnc';
import scanImageNutrients from '../use/useScanImageNutrients';

export default function ScanFood({navigation, route}: any) {

    const { date } = route.params;

    const [permission, requestPermission] = useCameraPermissions();
    const cameraRef = useRef<any>(null);

    const [barcode, setBarcode] = useState<any>(null);

    useEffect(() => {
        if (barcode) {
            scanImageNutrients(barcode, date)
        }
    }, [barcode]);


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

    return (
        <>

            <View style={tw`flex-1 justify-center`}>
               
                <CameraView ref={cameraRef} style={tw`flex-1`} facing='back' onBarcodeScanned={({data}: any) => {
                    if (barcode) return;

                    setBarcode(data)
                }}>
                    <View style={tw`flex-1 flex-row bg-transparent m-16`}>
                        <View style={tw`flex-1 justify-center items-center absolute inset-0`}>
                            <View style={tw`w-80 h-40`}>
                                <View style={tw`absolute top-0 left-0 w-12 h-6 border-t-4 border-l-4 border-white rounded-tl-xl`} />
                                <View style={tw`absolute top-0 right-0 w-12 h-6 border-t-4 border-r-4 border-white rounded-tr-xl`} />
                                <View style={tw`absolute bottom-0 left-0 w-12 h-6 border-b-4 border-l-4 border-white rounded-bl-xl`} />
                                <View style={tw`absolute bottom-0 right-0 w-12 h-6 border-b-4 border-r-4 border-white rounded-br-xl`} />
                            </View>
                        </View>
                    </View>
                </CameraView>
            
            </View>
        </>
    );
}
