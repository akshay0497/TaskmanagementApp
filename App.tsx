import React from 'react';
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { TaskListScreen } from './src/screens/TaskListScreen';
import { AddTaskScreen } from './src/screens/AddTaskScreen';
import { GestureHandlerRootView } from "react-native-gesture-handler";

export type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
};

export type RootStackParamList = {
  TaskList: { newTask?: Task; editedTask?: Task } | undefined;
  AddTask: { taskToEdit?: Task } | undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: true }}>
          <Stack.Screen name="TaskList" component={TaskListScreen} />
          <Stack.Screen name="AddTask" component={AddTaskScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
