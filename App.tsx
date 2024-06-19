import React, { useEffect, useRef, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, AppState, StatusBar, View } from 'react-native'
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

const Stack = createStackNavigator();

// initialParams={{ setupRan: setupRan }}

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






    /*const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);
    
    let appStateListener: any;

    useEffect(() => {

        appStateListener = AppState.addEventListener('change', _handleAppStateChange);
        return () => {
            appStateListener();
        }
        
    }, []);

    const _handleAppStateChange = (nextAppState: any) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            //console.log('App has come to the foreground!');
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
       // console.log('AppState', appState.current);

    }*/
       const App = () => {
        const [user, setUser] = useState<User | null>(null);
        const [loading, setLoading] = useState(true);
        const [setupRan, setSetupRan] = useState(false);
        const [checkingSetup, setCheckingSetup] = useState(true);
        const [goalNutrients, setGoalNutrients] = useState<GoalNutrients | null>(null);
    
        const [username, setUsername] = useState('');
        const [profilePicture, setProfilePicture] = useState('');
        const [friendRequestsNumber, setFriendRequestsNumber] = useState("");
    
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
                        checkLanguageDocument(usersCollectionRef);
    
                        setUsername(await getUsername(userInfoCollectionRef));
                        const profilePic = await getProfilePicture();
                        setProfilePicture(profilePic || '');
    
                        const friendRequests = await getFriendRequests();
                        if (friendRequests <= 9) {
                            setFriendRequestsNumber(friendRequests.toString());
                        } else {
                            setFriendRequestsNumber("9+");
                        }
    
                        setCheckingSetup(false); // Setup check completed
                    };
    
                    fetchData().then(() => setLoading(false));
                } else {
                    // No user, set loading to false and automatically navigate to the unauthenticated page
                    setLoading(false);
                    setCheckingSetup(false); // No setup check needed
                }
            });
    
            return () => unsubscribe();
        }, []);
    
        if (loading || checkingSetup) { // Modified condition to include checkingSetup
            return (
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator size="large" color="#007AFF" />
                </View>
            );
        }
    
        return (
            <GlobalContext.Provider value={{ setupRan, setSetupRan, username, profilePicture, goalNutrients, setUsername, setProfilePicture, friendRequestsNumber, setGoalNutrients }}>
                <GestureHandlerRootView style={{flex: 1}}>
                    <StatusBar barStyle='dark-content'/>
                    <NavigationContainer>
                        {user ? (setupRan ? <AuthenticatedTabNavigator /> : <SetupPage />) : <UnauthenticatedTabNavigator />}
                    </NavigationContainer>
                </GestureHandlerRootView>
            </GlobalContext.Provider>
        );
    };

export default App;