import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Main from "../screens/Main";
import { getCurrentDay, getCurrentExercise } from "../../globals";
import ActiveWorkout from "../screens/ActiveWorkout";
import Food from "../screens/Food";
import Settings from "../screens/Settings";
import SettingsMacros from "../screens/SettingsMacros";
import SettingsAccount from "../screens/SettingsAccount";
import SavedWorkouts from "../screens/SavedWorkouts";
import Workouts from "../screens/Workouts";
import ViewSavedWorkout from "../screens/ViewSavedWorkout";
import FoodDay from "../screens/FoodDay";
import AddFoodPage from "../screens/AddFoodPage";
import AddCustomFoodPage from "../screens/AddCustomFoodPage";
import AddWorkoutPage from "../screens/AddWorkoutPage";

const Stack = createNativeStackNavigator();

const MainPageComponent = () => {

  let currentExerciseTitle = getCurrentExercise()?.title;
  let currentDayTitle = getCurrentDay()?.title;

    return (
      <Stack.Navigator
        screenOptions={{
          animation: 'slide_from_right',
        }}
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
              title: "Запазени тренировки",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="Запазена-Тренировка"
            component={ViewSavedWorkout}
            options={{
              title: "Запазенa тренировкa",
              headerShown: false,
            }}
          />

          <Stack.Screen
            name='АктивнаТренировка'
            component={ActiveWorkout}
            options={() => ({
              title:currentDayTitle,
              headerShown: false,
              gestureEnabled: false,
            })}
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
                title: "Акаунт",
                headerShown: false,
                
            }}
          />

      </Stack.Navigator>
    );
  };

export default MainPageComponent;