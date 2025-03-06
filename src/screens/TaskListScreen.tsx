import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RootStackParamList, Task } from '../../App';
import { StackNavigationProp } from '@react-navigation/stack';


const PRELOADED_TASKS: Task[] = [
  { id: "1", title: "Buy groceries", description: "Milk, Bread, Eggs", completed: false, createdAt: new Date() },
  { id: "2", title: "Call the doctor", description: "Schedule an appointment", completed: false, createdAt: new Date() },
  { id: "3", title: "Finish React Native project", description: "Complete AsyncStorage integration", completed: false, createdAt: new Date() }
];


export const TaskListScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem("tasks");
      if (!storedTasks) {
        await AsyncStorage.setItem("tasks", JSON.stringify(PRELOADED_TASKS));
        setTasks(PRELOADED_TASKS);
      } else {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  };


  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveTasks(updatedTasks);
  };

 const deleteTask = async (taskId: string) => {
  const taskToDelete = tasks.find(task => task.id === taskId);
  if (!taskToDelete) return;

  Alert.alert(
    "Delete Task",
    `Are you sure you want to delete "${taskToDelete.title}"?`,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive", 
        onPress: async () => {
          const updatedTasks = tasks.filter(task => task.id !== taskId);
          await saveTasks(updatedTasks);
        }
      }
    ]
  );
};


  const handleEditTask = (task: Task) => {
    if (task.completed) {
      Alert.alert('Task Completed', 'You cannot edit a completed task.');
      return;
    }
    navigation.navigate('AddTask', { taskToEdit: task });
  };

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search tasks..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <FlatList
        data={filteredTasks}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <TouchableOpacity onPress={() => toggleTaskCompletion(item.id)}>
              <Icon
                name={item.completed ? 'check-box' : 'check-box-outline-blank'}
                size={24}
                color="#007AFF"
              />
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text
                style={[
                  styles.taskTitle,
                  item.completed && styles.completedTaskTitle,
                ]}>
                {item.title}
              </Text>
              <Text style={styles.taskDescription}>{item.description}</Text>
            </View>
            <TouchableOpacity onPress={() => handleEditTask(item)}>
              <Icon name="edit" size={24} color="#FFA500" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => deleteTask(item.id)}>
              <Icon name="delete" size={24} color="#FF3B30" />
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
      />
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}>
        <Icon name="add" size={30} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  searchInput: {
    margin: 16,
    padding: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    fontSize: 16,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 8,
  },
  taskContent: { flex: 1 },
  taskTitle: { fontSize: 16, fontWeight: '600', marginBottom: 4 },
  completedTaskTitle: { textDecorationLine: 'line-through', color: '#8E8E93' },
  taskDescription: { fontSize: 14, color: '#8E8E93' },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
