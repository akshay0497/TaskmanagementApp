export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  dueDate?: string;
  reminder?: string;
}

export interface ValidationErrors {
  title?: string;
  description?: string;
  dueDate?: string;
  reminder?: string;
}