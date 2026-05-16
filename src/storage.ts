import fs from 'fs';
import path from 'path';
import { Todo } from './types';

const dataFolder = path.resolve(__dirname, '..', 'data');
const todosFilePath = path.join(dataFolder, 'todos.json');

export function ensureStorage(): void {
  if (!fs.existsSync(dataFolder)) {
    fs.mkdirSync(dataFolder, { recursive: true });
  }

  if (!fs.existsSync(todosFilePath)) {
    fs.writeFileSync(todosFilePath, '[]', 'utf-8');
  }
}

export function readTodosFromFile(): unknown {
  ensureStorage();

  try {
    const rawData = fs.readFileSync(todosFilePath, 'utf-8');
    return JSON.parse(rawData);
  } catch (error) {
    console.error('Gagal membaca data To-Do:', error);
    return [];
  }
}

export function writeTodosToFile(todos: Todo[]): void {
  ensureStorage();
  fs.writeFileSync(todosFilePath, JSON.stringify(todos, null, 2), 'utf-8');
}
