import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "../screens/Main";
import Food from "../foodScreens/Food";
import Settings from "../settingsScreens/Settings";
import SettingsMacros from "../settingsScreens/SettingsMacros";
import SettingsAccount from "../settingsScreens/SettingsAccount";
import SavedWorkouts from "../workoutScreens/SavedWorkouts";
import Workouts from "../workoutScreens/Workouts";
import FoodDay from "../foodScreens/FoodDay";
import AddFoodPage from "../foodScreens/AddFoodPage";
import AddCustomFoodPage from "../foodScreens/AddCustomFoodPage";
import AddWorkoutPage from "../workoutScreens/AddWorkoutPage";
import ActiveWorkout from "../workoutScreens/ActiveWorkout";
import ViewWorkout from "../workoutScreens/ViewWorkout";
import FriendsList from "../friendsScreens/FriendsList";
import AddFriends from "../friendsScreens/AddFriends";
import FriendRequestsSent from "../friendsScreens/FriendRequestsSent";
import FriendRequestsRecieved from "../friendsScreens/FriendRequestsRecieved";
import ViewSavedWorkout from "../workoutScreens/ViewSavedWorkout";
import Statistics from "../settingsScreens/Statistics";
import ViewFriendProfile from "../friendsScreens/ViewFriendProfile";
import FoodInfo from "../foodScreens/FoodInfo";
import GenerateWorkoutPage from "../workoutScreens/GenerateWorkoutPage";
import ScanFood from "../foodScreens/ScanFood";
import WorkoutFolder from "../workoutScreens/WorkoutFolder";
import AddFoodPageEditFood from "../foodScreens/AddFoodPageEditFood";
import ViewUser from "../friendsScreens/ViewUser";

const Stack = createNativeStackNavigator();

const MainPageComponent = () => {

    return (
      <Stack.Navigator
      >

          <Stack.Screen
              name='Главна Страница'
              component={Main}
              options={() => ({
                headerShown: false,
                headerTintColor: '#fff',
                headerStyle: {
                  backgroundColor: '#007AFF',
                },
              })}
          />

          <Stack.Screen
              name="Тренировки"
              component={Workouts}
              options={{
                  title: "Тренировки",
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Папка"
              component={WorkoutFolder}
              options={{
                  title: "Тренировки",
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Генериране-Тренировка"
              component={GenerateWorkoutPage}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Активна-Тренировка"
              component={ActiveWorkout}
              options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationDuration: 0,
              }}
          />

          <Stack.Screen
              name="Тренировка-Детайли"
              component={ViewWorkout}
              options={{
                  headerShown: false,
                  
              }}
          />

          <Stack.Screen
              name="Тренировка-Добави"
              component={AddWorkoutPage}
              options={{
                headerShown: false,
              }}
          />

          <Stack.Screen
              name="Запазени-Тренировки"
              component={SavedWorkouts}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Виж-Запазенa-Тренировка"
              component={ViewSavedWorkout}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Хранене"
              component={Food}
              options={{
                  title: "Хранене",
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Хранене-Ден"
              component={FoodDay}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Храна-Сканиране"
              component={ScanFood}
              options={{
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Храна-Потърси"
              component={AddFoodPage}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Храна-Добави"
              component={AddCustomFoodPage}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Храна-Добави-Подробности"
              component={AddFoodPageEditFood}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Храна-Подробности"
              component={FoodInfo}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Настройки-Страница"
              component={Settings}
              options={{
                  title: "Настройки",
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Настройки-Макронутриенти"
              component={SettingsMacros}
              options={{
                  title: "Макронутриенти",
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Настройки-Акаунт"
              component={SettingsAccount}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Настройки-Статистика"
              component={Statistics}
              options={{
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Приятели"
              component={FriendsList}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Приятели-Добави"
              component={AddFriends}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Приятел-Акаунт"
              component={ViewFriendProfile}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Приятели-Покани-Изпратени"
              component={FriendRequestsSent}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Приятели-Покани-Получени"
              component={FriendRequestsRecieved}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Виж-Потърсен-Потребител"
              component={ViewUser}
              options={{
                  headerShown: false,
              }}
          />

          

      </Stack.Navigator>
    );
  };

export default MainPageComponent;