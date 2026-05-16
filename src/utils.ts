import { Todo, TodoPriority } from './types';

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function isValidString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

export function formatDateTime(date: Date): string {
  return date.toLocaleString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function isTodo(value: unknown): value is Todo {
  if (!isObject(value)) {
    return false;
  }

  const todo = value as Record<string, unknown>;

  const isValidPriority =
    todo.priority === undefined ||
    todo.priority === 'low' ||
    todo.priority === 'medium' ||
    todo.priority === 'high';

  return (
    typeof todo.id === 'number' &&
    isValidString(todo.title) &&
    typeof todo.completed === 'boolean' &&
    isValidString(todo.createdAt) &&
    isValidPriority &&
    (todo.dueDate === undefined || typeof todo.dueDate === 'string') &&
    (todo.dueTime === undefined || typeof todo.dueTime === 'string')
  );
}

export function isTodoArray(value: unknown): value is Todo[] {
  return Array.isArray(value) && value.every(isTodo);
}

export function normalizePriority(value: string): TodoPriority | undefined {
  const normalized = value.trim().toLowerCase();
  if (
    normalized === 'low' ||
    normalized === 'medium' ||
    normalized === 'high'
  ) {
    return normalized;
  }
  return undefined;
}

export function isValidDate(dateString: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  return date.toISOString().startsWith(dateString);
}

export function isValidTime(timeString: string): boolean {
  const regex = /^([01]\d|2[0-3]):([0-5]\d)$/;
  return regex.test(timeString);
}
