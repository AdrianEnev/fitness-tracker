import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import { onAuthStateChanged, User } from 'firebase/auth';
import { FIREBASE_AUTH, FIRESTORE_DB } from './firebaseConfig';
import Login from './app/screens/Login';
import Register from './app/screens/Register';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, StatusBar, View } from 'react-native'
import MainPageComponent from './app/components/MainPageComponent';
import Setup from './app/screens/Setup';
import { collection, doc, getDocs } from 'firebase/firestore';
import { createStackNavigator } from '@react-navigation/stack';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const headerOptions = {
  tabBarHideOnKeyboard: true,
  headerTintColor: '#fff',
  headerStyle: {
    backgroundColor: '#007AFF',
  },
};


const AuthenticatedTabNavigator = ({ setupRan }: any) => {
    
    return (
        <Stack.Navigator>

            {!setupRan && ( 
                <Stack.Screen
                    name='Първоначални-Настройки'
                    component={Setup}
                    options={() => ({
                        headerShown: false,
                    })}
                />
            )}

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

    <Tab.Navigator>

        <Tab.Screen
            name="Вход"
            component={Login}
            options={{
                headerTitle: 'Вход',
                tabBarIcon: ({ color }) => <Ionicons name="log-in-outline" color={color} size={32} />,
                ...headerOptions,
            }}
        />
        <Tab.Screen
            name="Регистрация"
            component={Register}
            options={{
                headerTitle: 'Регистрация',
                tabBarIcon: ({ color }) => <Ionicons name="key-outline" color={color} size={32} />,
                ...headerOptions,
            }}
        />

    </Tab.Navigator>

);

const App = () => {

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

                const checkUserInfoCollection = async () => {
                    try {
                        const snapshot = await getDocs(userInfoCollectionRef);
                        if (snapshot.empty) {
                            
                            setSetupRan(false);
                            setLoading(false);

                            console.log('No matching documents.');
            
                        }else{
                            setSetupRan(true);
                            setLoading(false);

                            console.log('Document found');
                        }
                    } catch (err) {
                        console.error(err);
                    }
                }
                checkUserInfoCollection();
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