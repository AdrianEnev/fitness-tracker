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

const MainMenuStack = () => {

    return (
      <Stack.Navigator
      >
          <Stack.Screen
              name='Main'
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
              name="Workouts"
              component={Workouts}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Workout-Folder"
              component={WorkoutFolder}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Generate-Workout"
              component={GenerateWorkoutPage}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Active-Workout"
              component={ActiveWorkout}
              options={{
                  headerShown: false,
                  gestureEnabled: false,
                  animationDuration: 0,
              }}
          />

          <Stack.Screen
              name="View-Workout"
              component={ViewWorkout}
              options={{
                  headerShown: false,
                  
              }}
          />

          <Stack.Screen
              name="Add-Workout"
              component={AddWorkoutPage}
              options={{
                headerShown: false,
              }}
          />

          <Stack.Screen
              name="Saved-Workouts"
              component={SavedWorkouts}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="View-Saved-Workout"
              component={ViewSavedWorkout}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Food"
              component={Food}
              options={{
                  title: "Food",
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Food-Day"
              component={FoodDay}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Scan-Food"
              component={ScanFood}
              options={{
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Add-Food"
              component={AddFoodPage}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Add-Custom-Food"
              component={AddCustomFoodPage}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Add-Food-Details"
              component={AddFoodPageEditFood}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Food-Info"
              component={FoodInfo}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Settings"
              component={Settings}
              options={{
                  title: "Settings",
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Settings-Macros"
              component={SettingsMacros}
              options={{
                  title: "Macronutrients",
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Settings-Account"
              component={SettingsAccount}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Settings-Statistics"
              component={Statistics}
              options={{
                  headerShown: false,
              }}
          />
          
          <Stack.Screen
              name="Friends"
              component={FriendsList}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Add-Friends"
              component={AddFriends}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="View-Friend-Profile"
              component={ViewFriendProfile}
              options={{
                  headerShown: false,
              }}
          />

          <Stack.Screen
              name="Friend-Requests-Sent"
              component={FriendRequestsSent}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="Friend-Requests-Recieved"
              component={FriendRequestsRecieved}
              options={{
                  headerShown: false,
              }}
          />
          <Stack.Screen
              name="View-User"
              component={ViewUser}
              options={{
                  headerShown: false,
              }}
          />

      </Stack.Navigator>
    );
  };

export default MainMenuStack;