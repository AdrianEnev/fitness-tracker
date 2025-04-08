import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "@screens/Main";
import Food from "@screens/food/Food";
import Settings from "@screens/settings/Settings";
import SettingsMacros from "@screens/settings/SettingsMacros";
import SettingsAccount from "@screens/settings/SettingsAccount";
import SavedWorkouts from "@screens/workouts/SavedWorkouts";
import Workouts from "@screens/workouts/Workouts";
import FoodDay from "@screens/food/FoodDay";
import AddFoodPage from "@screens/food/AddFoodPage";
import AddCustomFoodPage from "@screens/food/AddCustomFoodPage";
import AddWorkoutPage from "@screens/workouts/AddWorkoutPage";
import ActiveWorkout from "@screens/workouts/ActiveWorkout";
import ViewWorkout from "@screens/workouts/ViewWorkout";
import FriendsList from "@screens/friends/FriendsList";
import AddFriends from "@screens/friends/AddFriends";
import FriendRequestsSent from "@screens/friends/FriendRequestsSent";
import FriendRequestsRecieved from "@screens/friends/FriendRequestsRecieved";
import ViewSavedWorkout from "@screens/workouts/ViewSavedWorkout";
import Statistics from "@screens/settings/Statistics";
import ViewFriendProfile from "@screens/friends/ViewFriendProfile";
import FoodInfo from "@screens/food/FoodInfo";
import GenerateWorkoutPage from "@screens/workouts/GenerateWorkoutPage";
import ScanFood from "@screens/food/ScanFood";
import WorkoutFolder from "@screens/workouts/WorkoutFolder";
import AddFoodPageEditFood from "@screens/food/AddFoodPageEditFood";
import ViewUser from "@screens/friends/ViewUser";

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