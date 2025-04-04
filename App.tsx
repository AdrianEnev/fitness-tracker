import React, { useEffect, useState } from 'react';
import { StatusBar, View, Text, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainPageComponent from './app/components/MainPageComponent';
import Setup from './app/screens/Setup';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './app/screens/Welcome';
import getProfilePicture from './app/use/useGetProfilePicture';
import GlobalContext from './GlobalContext';
import getFriendRequests from './app/useFriends/useGetFriendRequestsRecieved';
import ChangePassword from './app/screens/ChangePassword';
import { checkUserGoalNutrientsLocally, checkLanguageDocumentLocally, checkUsernamesMatch } from './app/use/useCheckUserInfo';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';
import * as LocalAuthentication from 'expo-local-authentication';
import NetInfo from "@react-native-community/netinfo";
import checkReceiveFriendRequestsLocally from './app/useFriends/useCheckReceiveFriendRequestsLocally';
import checkFaceIdEnabledLocally from './app/use/useCheckFaceIdEnabledLocally';
import checkForBiometricsLocally from './app/use/checkForBiometricsLocally';
import EmailNotVerified from './app/screens/EmailNotVerified';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getLocalLanguageSet from './app/use/useGetLocalLanguageSet';
import LanguageScreen from './app/screens/LanguageScreen';
import { useNavigationContainerRef } from '@react-navigation/native';
import syncInformation from './app/use/useSyncInfo';
import checkInternetSpeed from './app/use/useCheckInternetSpeed';
import * as Device from 'expo-device';
import LanguageScreenSmall from './app/screens/LanguageScreenSmall';
import { StripeProvider } from '@stripe/stripe-react-native';
//import getEmail from './app/use/useGetEmail';
import { getLungeCoins } from './app/use/useGetLungeCoins';
import clearAsyncStorage from './app/use/useClearAsyncStorage';
import checkIsAccountLimitReached from './app/use/useCheckAccountLimitReached';

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

    /*const clearEmailFoodDayData = async () => {
        try {

            const email = await getEmail();

            const keys = await AsyncStorage.getAllKeys();
            const emailKeys = keys.filter(key => key.startsWith(`folders_${email}`));
            await AsyncStorage.multiRemove(emailKeys);
            console.log(`Cleared all items in folders_${email}`);
        } catch (error) {
            console.error("Error clearing AsyncStorage items:", error);
        }
    };*/

    const onAuthenticate = async () => {

        const auth = await LocalAuthentication.authenticateAsync({
            promptMessage: t('face-id-prompt'),
            cancelLabel: t('cancel')
        });

        if (auth.success) {
            setIsAuthenticated(true);
            //console.log(auth);
        } else {
            console.log('Authentication failed or cancelled');
            onAuthenticate();
        }
    };

    const BiometricsFailed = () => {

        return (
            <View style={tw`flex-1 justify-center items-center bg-white`}>
                
                <TouchableOpacity style={tw`w-[75%] h-[6.5%] bg-gray-700 rounded-[30px] shadow-lg flex items-center justify-center`}
                   onPress={() => onAuthenticate()}
                >
                    <Text style={tw`text-3xl font-semibold text-white`}>{t('try-face-id-again')}</Text>
                </TouchableOpacity>
                
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

    const [accountJustRegistered, setAccountJustRegistered] = useState(false);

    const [iphoneModel, setIphoneModel] = useState('')

    const [loggingIn, setLoggingIn] = useState(false);

    const [internetSpeed, setInternetSpeed] = useState(0);
    
    const [lungeCoinsAmount, setLungeCoinsAmount] = useState(0)

    const getIphoneModel = async () => {
        if (Device.brand === 'Apple') {
            setIphoneModel(Device.modelName || 'Unknown iPhone');
        } 
    };

    const fetchData = async () => {
        try {
            const setupHasRanLocally = await checkUserGoalNutrientsLocally();
            setSetupRan(setupHasRanLocally);

            const lungeCoins = await getLungeCoins();
            setLungeCoinsAmount(lungeCoins);
            
            checkLanguageDocumentLocally();
            checkUsernamesMatch();
            
            let profilePic = null;
            let friendRequests = 0;

            const netInfo = await NetInfo.fetch();
            setIsConnected(netInfo.isConnected ?? false);

            if (netInfo.isConnected) {
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

            const localLanguageSet = await getLocalLanguageSet();
            if (localLanguageSet) {
                setLocalLanguageSet(true)
            }
    
            const netInfo = await NetInfo.fetch();
            setIsConnected(netInfo.isConnected ?? false);

            try {
                if (netInfo.isConnected) {
                    const speed = await checkInternetSpeed()
                    setInternetSpeed(speed)
                    //console.log(speed)
                }
            }catch (error: any) {
                console.log('Failed to check internet speed')
                console.log(error)
            }
            
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
    
    }, []);

    useEffect(() => {
        const netListener = NetInfo.addEventListener(async state => {
            try {
                if (state.isConnected) {
                    const speed = await checkInternetSpeed();
                    setInternetSpeed(speed);
                }
                //setIsConnected(state.isConnected ?? false);
            } catch (error) {
                console.error("Error checking internet speed or setting connection state:", error);
            }
        });
    
        return () => netListener();
    }, []);

    useEffect(() => {
        
        const checkInternetConnection = async () => {
            const netInfo = await NetInfo.fetch();

            try {
                if (netInfo.isConnected) {
                    const speed = await checkInternetSpeed()
                    setInternetSpeed(speed);

                    /*if (speed < 32) {
                        setIsConnected(false)
                    }else{
                        setIsConnected(true)
                    }*/
                }
            } catch (error: any) {
                console.log('failed to check internet speed');
                console.log(error);
            }
            
        };

        // Run checkInternetConnection every 10 seconds
        // Delay the first call to checkInternetConnection by 2 seconds
        const timeout = setTimeout(() => {

            checkInternetConnection();

            // Run checkInternetConnection every 10 seconds after the initial delay
            const interval = setInterval(() => {
                checkInternetConnection();
                //console.log('checked internet connection')
            }, 10000);

            // Clear interval on unmount
            return () => clearInterval(interval);
        }, 2000);

        // Clear interval on unmount
        return () => clearInterval(timeout);
    }, []);

    useEffect(() => {
        const interval = setInterval(async () => {

            if (user && !isEmailVerified) {
                await user.reload().then(() => {
                    if (user.emailVerified) {
                        setIsEmailVerified(true);
                        setEmailVerifiedChanged(true);
                        setAccountJustRegistered(false);
                        setSetupRan(false);
                    }
                    console.log('interval ran')
                });
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

        if (isConnected && isAuthenticated && !hasSynced && user && internetSpeed > 32) {
            setHasSynced(true);

            const query = async () => {
                setSyncingInfoRunning(true)
                await syncInformation();
                setSyncingInfoRunning(false)
            }
            query();
        }
    }, [isConnected, isAuthenticated, hasSynced]);

    // listen for firebase.logOut and navigate to unauthenticated screen if called
    useEffect(() => {

        const unsubscribe = FIREBASE_AUTH.onAuthStateChanged(async (user) => {
            if (user && isConnected) {
                setIsAuthenticated(true);

                // check goal nutrients again -> prevents setup from running unnecessarily on login
                //const setupHasRanLocally = await checkUserGoalNutrientsLocally();
                //setSetupRan(setupHasRanLocally);
                
                setIsAccountDeleted(false);
            } else if (!user && isConnected) {
                setIsAuthenticated(false);
            }
          });
      
          // Clean up the subscription
          return () => unsubscribe();

    }, [navigationRef])

    useEffect(() => {

        //clearAsyncStorage();
        //logAsyncStorage()
        //clearEmailFoodDayData('test')
        //tempFunc()
        getIphoneModel();
        //clearEmailFoodDayData();

    }, [])

    const handleNavigation = () => {

        // Handles the logic for navigation based on language and authentication
        if (!localLanguageSet && !iphoneModel.includes('SE')) {
            return <LanguageScreen setLocalLanguageSet={setLocalLanguageSet} />;
        }else if (!localLanguageSet && iphoneModel.includes('SE')) {
            return <LanguageScreenSmall setLocalLanguageSet={setLocalLanguageSet} />;
        }

        if (!localEmail && !user) {
            return <UnauthenticatedTabNavigator />;
        } else {
            return isAccountDeleted && setupRan && !user ? (
                <UnauthenticatedTabNavigator />
            ) : setupRan && isAuthenticated && user && !accountJustRegistered  ? (
                <AuthenticatedTabNavigator setupRan={setupRan} />
            ) : !isEmailVerified && user && accountJustRegistered ? (
                <EmailNotVerified />
            ) : setupRan && !isAuthenticated && user ? (
                <BiometricsFailed />
            )  : user && !setupRan ?  (
                <SetupPage />
            ): (
                <UnauthenticatedTabNavigator />
            );
        }
    };

   if (loading || checkingSetup || loggingIn) {
        return (
            <View style={tw`flex-1 justify-center items-center bg-red-500`}>

                <LottieView
                    style={{ width: 350, height: 350 }}
                    source={require('./assets/loading_plane.json')}
                    speed={2}
                    autoPlay
                    loop
                />
                
                {/*
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
                */}

            </View>
        );
    }

    return (
        <GlobalContext.Provider value={{
            setupRan, setSetupRan, profilePicture, setProfilePicture, friendRequestsNumber,
            receiveFriendRequests, setReceiveFriendRequests, faceIdEnabled, setFaceIdEnabled,
            internetConnected: isConnected, isAccountDeleted, setIsAccountDeleted, generatingWorkout, setGeneratingWorkout,
            generatingWorkoutInFolder, setGeneratingWorkoutInFolder, syncingInfoRunning, setSyncingInfoRunning, internetSpeed, setAccountJustRegistered,
            iphoneModel, setLoggingIn, lungeCoinsAmount, setLungeCoinsAmount
        }}>

            <StripeProvider 
                publishableKey='pk_live_51QVygSBQgjh8yS4RaETuRan0FbyEXul8jW5nZ3hBgifdl569WcuEFVf13gtO4CJljkzTictxrijHJvAplHuqvOow00QoyahQqQ'
                merchantIdentifier="com.nafle.LungeFitnessTracker"
                urlScheme='lunge-fitness-tracker'
            >
                <GestureHandlerRootView style={tw`w-full h-full`}>
                    <StatusBar barStyle='dark-content' />
                    
                    {/*<
                        {handleNavigation()}
                        <SetupPage />
                        {handleNavigation()}
                        <LanguageScreen />
                    */}
                    
                    <NavigationContainer ref={navigationRef}>
                        {handleNavigation()}
                    </NavigationContainer>
                
                </GestureHandlerRootView>
            </StripeProvider>
        </GlobalContext.Provider>
    );
};

export default App;