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
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, setDoc } from 'firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';
import Welcome from './app/screens/Welcome';
import { SetupContext } from './SetupContext';

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

    </Stack.Navigator>

);




const App = () => {

    const appState = useRef(AppState.currentState);
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

    }

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [setupRan, setSetupRan] = useState(false);

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
            
            if (user) {

                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, user.uid);
                const userInfoCollectionRef = collection(userDocRef, 'user_info');

                const checkUserDocument = async () => {
                    try {
                        const userDocSnapshot = await getDoc(userDocRef);
                        if (!userDocSnapshot.exists()) {
                            await setDoc(userDocRef, { userID: user.uid, lastLogin: new Date(), registrationDate: new Date() });

                            addDoc(userInfoCollectionRef, {
                                status: 'online',
                            });
                        } else {
                            await setDoc(userDocRef, { userID: user.uid, lastLogin: new Date() }, { merge: true });
                            setDoc(doc(userInfoCollectionRef, 'status'), { status: 'online' });
                        }
                    } catch (err) {
                        console.error(err);
                    }

                };
                
                const checkLanguageDocument = async () => {
                    try {
                        const languageDocRef = doc(userInfoCollectionRef, 'language');
                        const languageDocSnapshot = await getDoc(languageDocRef);
                        if (!languageDocSnapshot.exists()) {
                            await setDoc(languageDocRef, { language: 'bg' });
                        }
                    } catch (err) {
                        console.error(err);
                    }
                };

                const checkUserInfoCollection = async () => {
                    try {
                        const nutrientsDocRef = doc(userInfoCollectionRef, 'nutrients');
                        const docSnapshot = await getDoc(nutrientsDocRef);
                        return docSnapshot.exists();
                        // exists
                    } catch (err) {
                        console.error(err);
                        return false;
                    }
                }

                const fetchData = async () => {
                    await checkUserDocument();
                    const setupHasRan = await checkUserInfoCollection();
                    setSetupRan(setupHasRan);
                    checkLanguageDocument();
                };

                fetchData().then(() => setLoading(false));
            }else{
                // no user, set loading to false and automatically navigate to the unathenticated page
                setLoading(false);
            }
          
        });

        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#007AFF" />
            </View>
        );
    }

    return (
        <SetupContext.Provider value={{ setupRan, setSetupRan }}>
            <GestureHandlerRootView style={{flex: 1}}>

                    <StatusBar barStyle='dark-content'/>

                    <NavigationContainer>

                        {user ? (setupRan ? <AuthenticatedTabNavigator /> : <SetupPage />) : <UnauthenticatedTabNavigator />}

                    </NavigationContainer>
            
            </GestureHandlerRootView>
        </SetupContext.Provider>
    );
};

export default App;