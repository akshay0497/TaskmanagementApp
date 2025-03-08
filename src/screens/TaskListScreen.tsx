import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Platform, Alert } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { Task } from '../types/task';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../App';
import Icon from 'react-native-vector-icons/MaterialIcons';

type TaskListScreenNavigationProp = StackNavigationProp<RootStackParamList, 'TaskList'>;

const TaskListScreen = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation<TaskListScreenNavigationProp>();
  const isFocused = useIsFocused();



  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('tasks');
      if (storedTasks) {
        const parsedTasks = JSON.parse(storedTasks);
        const sortedTasks = parsedTasks.sort((a: Task, b: Task) => {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setTasks(sortedTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  useEffect(() => {
    loadTasks(); 
  }, [tasks, isFocused]);

  
  const toggleTaskCompletion = async (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    await saveTasks(updatedTasks);
  };


  const saveTasks = async (updatedTasks: Task[]) => {
    try {
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };


  const deleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updatedTasks = tasks.filter(task => task.id !== taskId);
            await saveTasks(updatedTasks);
          },
        },
      ]
    );
  };

  // Render task item
  const renderItem = ({ item }: { item: Task }) => (
    <View style={[styles.taskItem, item.completed && styles.completedTask]}>
      <TouchableOpacity
        style={styles.checkbox}
        onPress={() => toggleTaskCompletion(item.id)}>
        <View style={[styles.checkboxInner, item.completed && styles.checked]} />
      </TouchableOpacity>
      
      <View style={styles.taskContent}>
        <Text style={[styles.taskTitle, item.completed && styles.completedText]}>
          {item.title}
        </Text>
        <Text style={styles.taskDescription}>{item.description}</Text>
        {item.dueDate && (
          <Text style={styles.taskDate}>
            Due: {format(new Date(item.dueDate), 'PPp')}
          </Text>
        )}
        {item.reminder && (
          <Text style={styles.reminderText}>
            Reminder: {format(new Date(item.reminder), 'PPp')}
          </Text>
        )}
      </View>
    </View>
  );


  const renderHiddenItem = ({ item }: { item: Task }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        style={[styles.backButton, styles.backButtonLeft]}
        onPress={() => {
          const taskToEdit = {
            ...item,
            createdAt: new Date(item.createdAt),
            dueDate: item.dueDate ? new Date(item.dueDate) : undefined,
            reminder: item.reminder ? new Date(item.reminder) : undefined,
          };
          navigation.navigate('AddTask', { taskToEdit });
        }}>
        <Icon name="edit" size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backButton, styles.backButtonRight]}
        onPress={() => deleteTask(item.id)}>
        <Icon name="delete" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );


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
        placeholderTextColor="#8E8E93"
      />

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={{ uri: 'https://rb.gy/w6f9cn' }}
            style={styles.emptyStateImage}
          />
          <Text style={styles.emptyStateText}>No tasks yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Add your first task by tapping the + button
          </Text>
        </View>
      ) : (
        <SwipeListView
          data={filteredTasks}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          leftOpenValue={75}
          previewRowKey={'0'}
          previewOpenValue={-40}
          previewOpenDelay={3000}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddTask')}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  searchInput: {
    margin: 16,
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    fontSize: 16,
    color: '#000000',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTask: {
    opacity: 0.7,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkboxInner: {
    width: 12,
    height: 12,
  },
  checked: {
    backgroundColor: '#007AFF',
  },
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 4,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: '#8E8E93',
  },
  taskDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  taskDate: {
    fontSize: 12,
    color: '#007AFF',
  },
  reminderText: {
    fontSize: 12,
    color: '#FF9500',
    marginTop: 4,
  },
  rowBack: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 75,
    height: '100%',
    borderRadius: 12,
  },
  backButtonLeft: {
    backgroundColor: '#FF9500',
  },
  backButtonRight: {
    backgroundColor: '#FF3B30',
  },
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
  },
  addButtonText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateImage: {
    width: 200,
    height: 200,
    marginBottom: 16,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8E8E93',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
  },
});

export default TaskListScreen;
