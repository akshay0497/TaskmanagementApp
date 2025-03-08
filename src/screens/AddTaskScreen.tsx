import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { Task, ValidationErrors } from '../types/task';

export const AddTaskScreen = () => {
  const [task, setTask] = useState<Task>({
    id: Math.random().toString(36).substr(2, 9),
    title: '',
    description: '',
    completed: false,
    createdAt: new Date().toISOString(),
  });

  const [showDueDatePicker, setShowDueDatePicker] = useState(false);
  const [showReminderPicker, setShowReminderPicker] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [reminderDate, setReminderDate] = useState<Date | null>(null);
  const [pickerMode, setPickerMode] = useState<'date' | 'time'>('date');
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const navigation = useNavigation();
  const route = useRoute();
  const taskToEdit = route.params?.taskToEdit;

  useEffect(() => {
    if (taskToEdit) {
      setTask(taskToEdit);
      if (taskToEdit.dueDate) setDueDate(new Date(taskToEdit.dueDate));
      if (taskToEdit.reminder) setReminderDate(new Date(taskToEdit.reminder));
    }
  }, [taskToEdit]);

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!task.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!task.description.trim()) {
      newErrors.description = 'Description is required';
    }


    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    try {
      const tasksJson = await AsyncStorage.getItem('tasks');
      const tasks: Task[] = JSON.parse(tasksJson || '[]');
  
      const updatedTask = {
        ...task,
        dueDate: dueDate?.toISOString(),
        reminder: reminderDate?.toISOString(),
      };
  
      let updatedTasks;
      if (taskToEdit) {
        updatedTasks = tasks.map(t => (t.id === task.id ? updatedTask : t));
      } else {
        updatedTasks = [...tasks, updatedTask];
      }
  
      await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      navigation.goBack();
      // Send the updated task list back to TaskListScreen
      navigation.getParent()?.setParams({ updatedTasks });
    } catch (error) {
      console.error('Error saving task:', error);
      Alert.alert('Error', 'Failed to save task');
    }
  };
  
  const onDateChange = (event: any, selectedDate: Date | undefined) => {
    const currentDate = selectedDate || (tempDate || new Date());
    
    if (Platform.OS === 'android') {
      if (event.type === 'dismissed') {
        setShowDueDatePicker(false);
        setShowReminderPicker(false);
        setPickerMode('date');
        return;
      }

      if (pickerMode === 'date') {
        setTempDate(currentDate);
        setPickerMode('time');
        return;
      }

      setPickerMode('date');
    }

    setTempDate(null);
    
    if (showDueDatePicker) {
      setDueDate(currentDate);
      setShowDueDatePicker(false);
    } else if (showReminderPicker) {
      setReminderDate(currentDate);
      setShowReminderPicker(false);
    }
  };

  const showDatePicker = (type: 'due' | 'reminder') => {
    if (Platform.OS === 'android') {
      setPickerMode('date');
    }
    
    if (type === 'due') {
      setShowDueDatePicker(true);
      setTempDate(dueDate || new Date());
    } else {
      setShowReminderPicker(true);
      setTempDate(reminderDate || new Date());
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={[styles.input, errors.title && styles.inputError]}
          value={task.title}
          onChangeText={text => setTask(prev => ({ ...prev, title: text }))}
          placeholder="Task title"
          placeholderTextColor="#8E8E93"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          value={task.description}
          onChangeText={text => setTask(prev => ({ ...prev, description: text }))}
          placeholder="Task description"
          placeholderTextColor="#8E8E93"
          multiline
          numberOfLines={4}
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

        <Text style={styles.label}>Due Date</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => showDatePicker('due')}>
          <Text style={styles.dateButtonText}>
            {dueDate ? format(dueDate, 'PPpp') : 'Select due date'}
          </Text>
        </TouchableOpacity>

        <Text style={styles.label}>Reminder</Text>
        <TouchableOpacity
          style={styles.dateButton}
          onPress={() => showDatePicker('reminder')}>
          <Text style={styles.dateButtonText}>
            {reminderDate ? format(reminderDate, 'PPpp') : 'Set reminder'}
          </Text>
        </TouchableOpacity>
        {errors.reminder && <Text style={styles.errorText}>{errors.reminder}</Text>}

        {((showDueDatePicker || showReminderPicker) && Platform.OS === 'ios') && (
          <DateTimePicker
            testID="dateTimePicker"
            value={showDueDatePicker ? (dueDate || new Date()) : (reminderDate || new Date())}
            mode="datetime"
            is24Hour={true}
            onChange={onDateChange}
            display="spinner"
          />
        )}

        {((showDueDatePicker || showReminderPicker) && Platform.OS === 'android') && (
          <DateTimePicker
            testID="dateTimePicker"
            value={tempDate || new Date()}
            mode={pickerMode}
            is24Hour={true}
            onChange={onDateChange}
            display="default"
          />
        )}

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>
            {taskToEdit ? 'Update Task' : 'Add Task'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F7',
  },
  form: {
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1E',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
    color: '#000000',
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 14,
    marginTop: 4,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  dateButtonText: {
    fontSize: 16,
    color: '#000000',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});