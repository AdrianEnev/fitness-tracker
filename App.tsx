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
import getProfilePicture from './app/use/useGetProfilePicture';
import GlobalContext from './GlobalContext';
import getFriendRequests from './app/useFriends/useGetFriendRequestsRecieved';
import ChangePassword from './app/screens/ChangePassword';
import { checkUserDocument, checkLanguageDocument, checkUserInfoCollection, checkUserInfoCollectionLocally, checkLanguageDocumentLocally } from './app/use/useCheckUserInfo';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import checkForBiometrics from './app/use/useCheckForBiometrics';
import NetInfo from "@react-native-community/netinfo";
import checkReceiveFriendRequestsLocally from './app/useFriends/useCheckReceiveFriendRequestsLocally';
import checkFaceIdEnabledLocally from './app/use/useCheckFaceIdEnabledLocally';
import checkForBiometricsLocally from './app/use/checkForBiometricsLocally';
import EmailNotVerified from './app/screens/EmailNotVerified';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getLocalLanguageSet from './app/use/useGetLocalLanguageSet';
import LanguageScreen from './app/screens/LanguageScreen';
import syncWorkouts from './app/syncData/useSyncWorkouts';
import syncSavedWorkouts from './app/syncData/useSyncSavedWorkouts';
import syncNutrients from './app/syncData/useSyncNutrients';
import syncFood from './app/syncData/useSyncFood';
import syncWorkoutsInFolders from './app/syncData/useSyncWorkoutsInFolders';
import { useNavigationContainerRef } from '@react-navigation/native';
import syncInformation from './app/use/useSyncInfo';

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
        <Stack.Screen
            name="Непотвърден-Имейл"
            component={EmailNotVerified}
            options={{
                headerShown: false,
                gestureEnabled: false,
            }}
        />


    </Stack.Navigator>
);

function App() {

    const clearAsyncStorage = async () => {
        await AsyncStorage.clear();
        console.log('async storage cleared')
    }


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

    const navigationRef = useNavigationContainerRef();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [setupRan, setSetupRan] = useState(false);
    const [checkingSetup, setCheckingSetup] = useState(true);
    const [profilePicture, setProfilePicture] = useState('');
    const [friendRequestsNumber, setFriendRequestsNumber] = useState("");
    const [receiveFriendRequests, setReceiveFriendRequests] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);
    const [isAccountDeleted, setIsAccountDeleted] = useState(false);

    const [isConnected, setIsConnected] = useState(false)

    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [localEmail, setLocalEmail] = useState<string | null>(null);

    const [localLanguageSet, setLocalLanguageSet] = useState(false);
    const [emailVerifiedChanged, setEmailVerifiedChanged] = useState(false);

    const [hasSynced, setHasSynced] = useState(false);

    const [generatingWorkout, setGeneratingWorkout] = useState(false);
    const [generatingWorkoutInFolder, setGeneratingWorkoutInFolder] = useState('');

    const [syncingInfoRunning, setSyncingInfoRunning] = useState(false);

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

            if (friendRequests <= 9 && friendRequests > 0) {
                setFriendRequestsNumber(friendRequests.toString())
            }else if (friendRequests == 0){
                setFriendRequestsNumber('');
            }else{
                setFriendRequestsNumber('9+');
            }
            
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
            } else {
                console.log(error);
            }
            setLoading(false);
            setCheckingSetup(false);
        }
    };

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

            //AsyncStorage.removeItem('language');

            const localLanguageSet = await getLocalLanguageSet();
            if (localLanguageSet) {
                setLocalLanguageSet(true)
            }
    
            const netInfo = await NetInfo.fetch();
            setIsConnected(netInfo.isConnected ?? false);

            //const netInfo = { isConnected: false }
            //setIsConnected(false)
    
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
            console.log(`Real-time Network status: ${state.isConnected ? 'Online' : 'Offline'}`);
        });
    
        return () => netListener();
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {
            if (user && !isEmailVerified) {
                await user.reload();
                if (user.emailVerified) {
                    setIsEmailVerified(true);
                    setEmailVerifiedChanged(true); // Update state when email is verified
                }
                console.log('interval ran')
            }
        }, 1000); 

        return () => clearInterval(interval);
    }, [user, isEmailVerified, isConnected]);

    useEffect(() => {
        if (emailVerifiedChanged) {
            setLoading(true);
            fetchData();
        }
    }, [emailVerifiedChanged]);

    useEffect(() => {

        if (isConnected && isAuthenticated && !hasSynced) {
            setHasSynced(true);

            const query = async () => {
                setSyncingInfoRunning(true)
                await syncInformation();
                setSyncingInfoRunning(false)
            }
            query();
        }
    }, [isConnected, isAuthenticated, hasSynced]);

    useEffect(() => {
        //clearAsyncStorage()
    })

    // listen for firebase.logOut and navigate to unauthenticated screen if called
    useEffect(() => {
        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged((user) => {
            if (!user && isConnected) {
                setIsAuthenticated(false)
            }
          });
      
          // Clean up the subscription
          return () => unsubscribe();
    }, [navigationRef])

    const handleNavigation = () => {
        // Handles the logic for navigation based on language and authentication
        if (!localLanguageSet) {
            return <LanguageScreen setLocalLanguageSet={setLocalLanguageSet} />;
        }

        if (!localEmail) {
            // Unauthenticated flow
            return <UnauthenticatedTabNavigator />;
        } else {
            // Authenticated or setup flow
            return isAccountDeleted ? (
                <UnauthenticatedTabNavigator />
            ) : setupRan && isAuthenticated && user ? (
                <AuthenticatedTabNavigator setupRan={setupRan} />
            ) : !isEmailVerified && user ? (
                <EmailNotVerified />
            ) : setupRan && !isAuthenticated && user ? (
                <BiometricsFailed />
            )  : user ? (
                <SetupPage />
            ): (
                <UnauthenticatedTabNavigator />
            );
        }
    };

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
            internetConnected: isConnected, isAccountDeleted, setIsAccountDeleted, generatingWorkout, setGeneratingWorkout,
            generatingWorkoutInFolder, setGeneratingWorkoutInFolder, syncingInfoRunning, setSyncingInfoRunning
        }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                
                <NavigationContainer ref={navigationRef}>{handleNavigation()}</NavigationContainer>
            </GestureHandlerRootView>
        </GlobalContext.Provider>
    );
};

export default App;