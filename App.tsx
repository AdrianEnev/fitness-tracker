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

const Stack = createStackNavigator();

const AuthenticatedTabNavigator = ({ setupRan }: any) => {
    
    return (
        <Stack.Navigator initialRouteName={setupRan ? "Главна-Страница" : "Първоначални-Настройки"}>
            <Stack.Screen
                name='Първоначални-Настройки'
                component={Setup}
                options={() => ({
                    headerShown: false,
                })}
            />
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

    React.useEffect(() => {
        const unsubscribe = onAuthStateChanged(FIREBASE_AUTH, (user) => {
            setUser(user);
            
            if (user) {

                //console.log(user)

                const usersCollectionRef = collection(FIRESTORE_DB, 'users');
                const userDocRef = doc(usersCollectionRef, user.uid);
                setDoc(userDocRef, { filler: 'Random text shtoto inache toq document stava ghost document' });

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
                        const snapshot = await getDocs(userInfoCollectionRef);
                        let documentFound = false;
                
                        snapshot.forEach((doc) => {
                            if (doc.id === "nutrients") {
                                documentFound = true;
                            }
                        });
                
                        if (documentFound) {
                            setSetupRan(true);
                            //console.log('Document with title "nutrients" found');
                        } else {
                            setSetupRan(false);
                            //console.log('No document with title "nutrients" found');
                        }
                
                        setLoading(false);
                    } catch (err) {
                        console.error(err);
                    }
                }
                const fetchData = async () => {
                    await checkUserInfoCollection();
                    checkLanguageDocument();
                };

                fetchData();
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
        <GestureHandlerRootView style={{flex: 1}}>

                <StatusBar barStyle='dark-content'/>

                <NavigationContainer>

                    {user ? <AuthenticatedTabNavigator setupRan = {setupRan}/> : <UnauthenticatedTabNavigator />}

                </NavigationContainer>
        
        </GestureHandlerRootView>
    );
};

export default App;