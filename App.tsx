import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StatusBar, View } from 'react-native'
import MainPageComponent from './app/components/MainPageComponent';
import Setup from './app/screens/Setup';
import { collection, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
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

    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [setupRan, setSetupRan] = useState(false);

    const onComplete = () => {
        setSetupRan(true);
    }

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
            
            if (user) {

                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, user.uid);
                setDoc(userDocRef, { userID: user.uid, lastLogin: new Date()});

                const userInfoCollectionRef = collection(userDocRef, 'user_info');

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
                        console.log('exists')
                        return docSnapshot.exists();
                    } catch (err) {
                        console.error(err);
                        return false;
                    }
                }

                const fetchData = async () => {
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