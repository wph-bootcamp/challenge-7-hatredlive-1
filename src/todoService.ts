import { Todo, TodoPriority } from './types';
import { readTodosFromFile, writeTodosToFile } from './storage';
import { isTodoArray } from './utils';

function loadTodos(): Todo[] {
  const data = readTodosFromFile();
  return isTodoArray(data) ? data : [];
}

export function getTodos(): Todo[] {
  return loadTodos();
}

export function addTodo(
  title: string,
  priority?: TodoPriority,
  dueDate?: string,
  dueTime?: string
): Todo {
  const trimmedTitle = title.trim();

  if (trimmedTitle.length === 0) {
    throw new Error('Judul To-Do tidak boleh kosong.');
  }

  const todos = loadTodos();
  const newTodo: Todo = {
    id: Date.now(),
    title: trimmedTitle,
    completed: false,
    createdAt: new Date().toISOString(),
    priority,
    dueDate: dueDate?.trim() || undefined,
    dueTime: dueTime?.trim() || undefined,
  };

  todos.unshift(newTodo);
  writeTodosToFile(todos);

  return newTodo;
}

export function markTodoAsComplete(id: number): Todo {
  const todos = loadTodos();
  const todo = todos.find((item) => item.id === id);

  if (!todo) {
    throw new Error(`To-Do dengan id ${id} tidak ditemukan.`);
  }

  if (!todo.completed) {
    todo.completed = true;
    writeTodosToFile(todos);
  }

  return todo;
}

export function deleteTodo(id: number): Todo {
  const todos = loadTodos();
  const index = todos.findIndex((item) => item.id === id);

  if (index === -1) {
    throw new Error(`To-Do dengan id ${id} tidak ditemukan.`);
  }

  const [removedTodo] = todos.splice(index, 1);
  writeTodosToFile(todos);

  return removedTodo;
}

export function listTodos(): Todo[] {
  return loadTodos();
}

export function searchTodos(keyword: string): Todo[] {
  const normalizedKeyword = keyword.trim().toLowerCase();
  if (normalizedKeyword.length === 0) {
    return [];
  }

  return loadTodos().filter((todo) => {
    const content = [
      todo.title,
      todo.priority ?? '',
      todo.dueDate ?? '',
      todo.dueTime ?? '',
    ]
      .join(' ')
      .toLowerCase();
    return content.includes(normalizedKeyword);
  });
}

export function formatTodoLine(todo: Todo, index: number): string {
  const statusLabel = todo.completed ? '[DONE]  ' : '[ACTIVE] ';
  const priorityLabel = todo.priority ? ` (${todo.priority})` : '';
  const scheduleLabel = todo.dueDate
    ? ` | ${todo.dueDate}${todo.dueTime ? ` ${todo.dueTime}` : ''}`
    : '';

  return `${statusLabel}${index}. ${todo.title}${priorityLabel}${scheduleLabel}`;
}
