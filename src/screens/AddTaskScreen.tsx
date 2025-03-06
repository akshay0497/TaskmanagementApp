import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Task } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';

export const AddTaskScreen = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'AddTask'>>();
  const taskToEdit = route.params?.taskToEdit || null;

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description);
    }
  }, [taskToEdit]);

  const handleAddOrUpdateTask = async () => {
    if (!title.trim()) return;

    const updatedTask: Task = {
      id: taskToEdit ? taskToEdit.id : Math.random().toString(36).substr(2, 9),
      title: title.trim(),
      description: description.trim(),
      completed: taskToEdit ? taskToEdit.completed : false,
      createdAt: taskToEdit ? taskToEdit.createdAt : new Date(),
    };

    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];

      let updatedTasks;
      if (taskToEdit) {
        updatedTasks = tasks.map((task: Task) =>
          task.id === taskToEdit.id ? updatedTask : task
        );
      } else {
        updatedTasks = [...tasks, updatedTask];
      }

      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.navigate('TaskList');
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={[styles.input, styles.descriptionInput]}
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        multiline
      />
      <TouchableOpacity style={styles.button} onPress={handleAddOrUpdateTask}>
        <Text style={styles.buttonText}>
          {taskToEdit ? 'Update Task' : 'Add Task'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#F2F2F7' },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  descriptionInput: { height: 100, textAlignVertical: 'top' },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
});
