export type TodoStatus = 'ACTIVE' | 'DONE';
export type TodoPriority = 'low' | 'medium' | 'high';

export interface Todo {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
  priority?: TodoPriority;
  dueDate?: string;
  dueTime?: string;
}
