import React, { useState } from 'react';
import { StatusBar, View, Text, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import MainPageComponent from './app/components/MainPageComponent';
import Setup from './app/screens/Setup';
import { collection, doc } from 'firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './app/screens/Welcome';
import getUsername from './app/use/useGetUsername';
import getProfilePicture from './app/use/useGetProfilePicture';
import GlobalContext from './GlobalContext';
import getFriendRequests from './app/use/useGetFriendRequestsRecieved';
import ChangePassword from './app/screens/ChangePassword';
import { checkUserDocument, checkLanguageDocument, checkUserInfoCollection } from './app/use/useCheckUserInfo';
import { GoalNutrients } from './interfaces';
import checkReceiveFriendRequests from './app/use/useCheckReceiveFriendRequests';
import checkFaceIdEnabled from './app/use/useCheckFaceIdEnabled';
import LottieView from 'lottie-react-native';
import tw from 'twrnc';
import { useTranslation } from 'react-i18next';

const logoWatchUpscaled = require('./assets/logo_watch_upscaled.png');

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

    const {t} = useTranslation();

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [setupRan, setSetupRan] = useState(false);
    const [checkingSetup, setCheckingSetup] = useState(true);
    const [goalNutrients, setGoalNutrients] = useState<GoalNutrients | null>(null);
    const [username, setUsername] = useState('');
    const [profilePicture, setProfilePicture] = useState('');
    const [friendRequestsNumber, setFriendRequestsNumber] = useState("");
    const [receiveFriendRequests, setReceiveFriendRequests] = useState(false);
    const [faceIdEnabled, setFaceIdEnabled] = useState(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
            if (user) {
                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, user.uid);
                const userInfoCollectionRef = collection(userDocRef, 'user_info');

                const fetchData = async () => {
                    await checkUserDocument(userDocRef, user, userInfoCollectionRef);
                    const setupHasRan = await checkUserInfoCollection(userInfoCollectionRef);
                    setSetupRan(setupHasRan);
                    checkLanguageDocument(userInfoCollectionRef);

                    setUsername(await getUsername(userInfoCollectionRef));
                    const profilePic = await getProfilePicture();
                    setProfilePicture(profilePic || '');

                    const friendRequests = await getFriendRequests();
                    if (friendRequests <= 9) {
                        setFriendRequestsNumber(friendRequests.toString());
                    } else {
                        setFriendRequestsNumber("9+");
                    }

                    const receiveFriendRequests = await checkReceiveFriendRequests(); // boolean
                    setReceiveFriendRequests(receiveFriendRequests);

                    const isFaceIdEnabled = await checkFaceIdEnabled();
                    setFaceIdEnabled(isFaceIdEnabled);

                    setCheckingSetup(false);
                };

                fetchData().then(() => setLoading(false));
            } else {
                setLoading(false);
                setCheckingSetup(false);
            }
        });

        return () => unsubscribe();
    }, []);

    if (loading || checkingSetup) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>

                <LottieView
                    style={{ width: 350, height: 350 }}
                    source={require('./assets/loading_plane.json')}
                    speed={2}
                    autoPlay
                    loop
                />

                <Text style={tw`text-2xl font-bold text-gray-700 mt-4`}>{t('loading-----')}...</Text>
            </View>
        );
    }

    return (
        <GlobalContext.Provider value={{
            setupRan, setSetupRan, username, profilePicture, goalNutrients,
            setUsername, setProfilePicture, friendRequestsNumber, setGoalNutrients,
            receiveFriendRequests, setReceiveFriendRequests, faceIdEnabled, setFaceIdEnabled
        }}>
            <GestureHandlerRootView style={{ flex: 1 }}>
                <StatusBar barStyle='dark-content' />
                <NavigationContainer>
                    {user ? (setupRan ? <AuthenticatedTabNavigator /> : <SetupPage />) : <UnauthenticatedTabNavigator />}
                </NavigationContainer>
            </GestureHandlerRootView>
        </GlobalContext.Provider>
    );
};

export default App;