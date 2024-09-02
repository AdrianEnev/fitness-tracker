import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, Image, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainPageComponent from './app/components/MainPageComponent';
import Setup from './app/screens/Setup';
import { collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './app/screens/Welcome';
import getUsername from './app/use/useGetUsername';
import getProfilePicture from './app/use/useGetProfilePicture';
import GlobalContext from './GlobalContext';
import getFriendRequests from './app/use/useGetFriendRequestsRecieved';
import ChangePassword from './app/screens/ChangePassword';
import { checkUserDocument, checkLanguageDocument, checkUserInfoCollection, checkUserInfoCollectionLocally, checkLanguageDocumentLocally } from './app/use/useCheckUserInfo';
import { GoalNutrients } from './interfaces';
import checkReceiveFriendRequests from './app/use/useCheckReceiveFriendRequests';
import checkFaceIdEnabled from './app/use/useCheckFaceIdEnabled';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import checkForBiometrics from './app/use/useCheckForBiometrics';
import NetInfo from "@react-native-community/netinfo";
import syncWorkouts from './app/use/syncWorkouts';
import syncSavedWorkouts from './app/use/syncSavedWorkouts';
import syncNutrients from './app/use/useSyncNutrients';
import checkReceiveFriendRequestsLocally from './app/use/useCheckReceiveFriendRequestsLocally';
import checkFaceIdEnabledLocally from './app/use/useCheckFaceIdEnabledLocally';
import checkForBiometricsLocally from './app/use/checkForBiometricsLocally';
import EmailNotVerified from './app/screens/EmailNotVerified';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

const SetupPage = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name='Първоначални-Настройки'
                component={Setup}
                options={() => ({
                    headerShown: false,
                })}
            />
        </Stack.Navigator>
    );
}

const AuthenticatedTabNavigator = ({ setupRan }: any) => {
    return (
        <Stack.Navigator initialRouteName={setupRan ? "Главна-Страница" : "Първоначални-Настройки"}>
            <Stack.Screen
                name="Главна-Страница"
                component={MainPageComponent}
                options={{
                    headerShown: false,
                    gestureEnabled: false,
                }}
            />
        </Stack.Navigator>
    );
};

const UnauthenticatedTabNavigator = () => (
    <Stack.Navigator>
        <Stack.Screen
            name="Добре-Дошъл"
            component={Welcome}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Регистрация"
            component={Register}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Вход"
            component={Login}
            options={{
                headerShown: false,
            }}
        />
        <Stack.Screen
            name="Парола-Смяна"
            component={ChangePassword}
            options={{
                headerShown: false,
            }}
        />
    </Stack.Navigator>
);

const App = () => {

    const onAuthenticate = async () => {
        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: 'Аутентикация с биометрия',
            cancelLabel: 'Отказ',
            fallbackLabel: 'Използвайте парола'
        });

        if (auth.success) {
            setIsAuthenticated(true);
            console.log(auth);
        } else {
            console.log('Authentication failed or cancelled');
        }
    };

    const BiometricsFailed = () => {
        return (
            <View style={tw`flex-1 justify-center items-center bg-red-500`}>
                <Text style={tw`text-2xl font-bold text-white`}>Biometrics Failed</Text>
                <Button title='Retry' onPress={() => onAuthenticate()} />
            </View>
        );
    }

    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const {t} = useTranslation();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [setupRan, setSetupRan] = useState(false);
    const [checkingSetup, setCheckingSetup] = useState(true);
    const [goalNutrients, setGoalNutrients] = useState<GoalNutrients | null>(null);
    const [profilePicture, setProfilePicture] = useState('');
    const [friendRequestsNumber, setFriendRequestsNumber] = useState("");
    const [receiveFriendRequests, setReceiveFriendRequests] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [lastSyncTime, setLastSyncTime] = useState(0)

    const [isConnected, setIsConnected] = useState(false)

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [localEmail, setLocalEmail] = useState<string | null>(null);

    const fetchData = async () => {
        try {
            const setupHasRanLocally = await checkUserInfoCollectionLocally();
            setSetupRan(setupHasRanLocally);

            checkLanguageDocumentLocally();
            
            let profilePic = null;
            let friendRequests = 0;

            if (isConnected) {
                profilePic = await getProfilePicture();
                friendRequests = await getFriendRequests();
            }
            
            const receiveFriendRequests = await checkReceiveFriendRequestsLocally();
            const isFaceIdEnabled = await checkFaceIdEnabledLocally();
    
            setProfilePicture(profilePic || '');
            setFriendRequestsNumber(friendRequests <= 9 ? friendRequests.toString() : "9+" || 0);
            setReceiveFriendRequests(receiveFriendRequests);
            setFaceIdEnabled(isFaceIdEnabled);
            setCheckingSetup(false);
        } catch (error) {
            console.error("Error fetching user data:", error);
            setCheckingSetup(false);
        } finally {
            setLoading(false);
        }
    };

    const checkLocalEmail = async () => {
        try {
            const email = await AsyncStorage.getItem('email');
            setLocalEmail(email);
        } catch (error) {
            console.error("Error checking local email:", error);
        }
    };

    const userLoggedIn = async (user: any) => {

        try {
            if (user) {
                setIsEmailVerified(user.emailVerified);

                if (await checkForBiometricsLocally()) {
                    const compatible = await LocalAuthentication.hasHardwareAsync();

                    if (compatible) {
                        await onAuthenticate();
                    }
                } else {
                    setIsAuthenticated(true);
                }

                if (user.emailVerified) {
                    setLoading(true);
                    await fetchData();
                } else {
                    setLoading(false);
                    setCheckingSetup(false);
                }
            } else {
                setLoading(false);
                setCheckingSetup(false);
            }
        } catch (error) {
            if (error == '[FirebaseError: Function doc() cannot be called with an empty path.]') {
                console.log('No user is logged in');
            }
            setLoading(false);
            setCheckingSetup(false);
        }

    }

    const userNotLoggedIn = async () => {
        if (await checkForBiometricsLocally()) {
            const compatible = await LocalAuthentication.hasHardwareAsync();

            if (compatible) {
                await onAuthenticate();
            }
        } else {
            setIsAuthenticated(true);
        }

        setLoading(true);
        await fetchData();
    }

    useEffect(() => {
        const initializeApp = async () => {
            await checkLocalEmail();
    
            //const netInfo = await NetInfo.fetch();
            //setIsConnected(netInfo.isConnected ?? false);

            const netInfo = { isConnected: false };
            setIsConnected(netInfo.isConnected);

            console.log(`Network status: ${netInfo.isConnected ? 'Online' : 'Offline'}`);
          

            if (netInfo.isConnected) {
                const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, async (user) => {
                    setUser(user);
                    userLoggedIn(user);
                });
    
                return () => unsubscribe();
            } else {
                userNotLoggedIn();
            }
        };
    
        initializeApp();
    
        const netListener = NetInfo.addEventListener(state => {
            setIsConnected(state.isConnected ?? false);
            // Debug log for real-time network status updates
            console.log(`Real-time Network status: ${state.isConnected ? 'Online' : 'Offline'}`);
        });
    
        return () => netListener();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (user && !isEmailVerified) {
                await user.reload();
                setIsEmailVerified(user.emailVerified);
            }
        }, 1000); 

        return () => clearInterval(interval);
    }, [user, isEmailVerified, isConnected]);

    if (loading || checkingSetup) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-red-500`}>
                <LottieView
                    style={{ width: 350, height: 350 }}
                    source={require('./assets/loading_plane.json')}
                    speed={2}
                    autoPlay
                    loop
                />
                <View style={tw`flex flex-row`}>
                    <Text style={tw`text-2xl font-bold text-white mt-4`}>{t('loading')}</Text>
                    <LottieView
                        style={tw`w-24 h-24 mt-[-6px] ml-[-22px]`}
                        source={require('./assets/loading_animation_white_dots.json')}
                        speed={0.8}
                        autoPlay
                        loop
                    />
                </View>
            </View>
        );
    }

    return (
        <GlobalContext.Provider value={{
            setupRan, setSetupRan, profilePicture, setProfilePicture, friendRequestsNumber,
            receiveFriendRequests, setReceiveFriendRequests, faceIdEnabled, setFaceIdEnabled,
            internetConnected: isConnected, lastSyncTime, setLastSyncTime
        }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                <NavigationContainer>
                    {   
                        localEmail ? 
                        (
                            isConnected ? 
                            (setupRan && isAuthenticated ? <AuthenticatedTabNavigator setupRan={setupRan} /> : 
                            setupRan && !isAuthenticated ? <BiometricsFailed /> :
                            !isEmailVerified ? <EmailNotVerified /> :
                            <SetupPage />) :
                            <AuthenticatedTabNavigator setupRan={setupRan} />
                        ) : 
                        <UnauthenticatedTabNavigator />
                    }
                </NavigationContainer>
            </GestureHandlerRootView>
        </GlobalContext.Provider>
    );
};

export default App;