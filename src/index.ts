import readline from 'readline';
import { Todo, TodoPriority } from './types';
import { ensureStorage } from './storage';
import {
  addTodo,
  deleteTodo,
  formatTodoLine,
  listTodos,
  markTodoAsComplete,
  searchTodos,
} from './todoService';
import {
  formatDateTime,
  isValidString,
  normalizePriority,
  isValidDate,
  isValidTime,
} from './utils';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function askQuestion(question: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function showMenu(): void {
  console.log(`\n=== TypeScript To-Do Lee-st ===`);
  console.log(`1. Add new To-Do`);
  console.log(`2. Mark To-Do as complete`);
  console.log(`3. Delete To-Do`);
  console.log(`4. List all To-Dos`);
  console.log(`5. Search To-Dos`);
  console.log(`6. Exit`);
}

function displayTodos(todos: Todo[]): void {
  if (todos.length === 0) {
    console.log('Tidak ada To-Do saat ini.');
    return;
  }

  console.log('\nDaftar To-Do:');
  todos.forEach((todo, index) => {
    console.log(formatTodoLine(todo, index + 1));
  });
}

async function handleAddTodo(): Promise<void> {
  const title = await askQuestion('Masukkan judul To-Do: ');

  if (!isValidString(title)) {
    console.log('Judul To-Do tidak boleh kosong.');
    return;
  }

  let priority: TodoPriority | undefined;
  while (true) {
    const priorityInput = await askQuestion(
      'Masukkan priority [low|medium|high] (optional, tekan Enter untuk skip): '
    );
    if (!priorityInput.trim()) {
      break;
    }
    priority = normalizePriority(priorityInput);
    if (priority) {
      break;
    }
    console.log('Priority tidak valid. Gunakan low, medium, atau high.');
  }

  let dueDate: string | undefined;
  while (true) {
    const dueDateInput = await askQuestion(
      'Masukkan due date (YYYY-MM-DD, optional, tekan Enter untuk skip): '
    );
    if (!dueDateInput.trim()) {
      break;
    }
    if (isValidDate(dueDateInput.trim())) {
      dueDate = dueDateInput.trim();
      break;
    }
    console.log('Format due date tidak valid. Gunakan format YYYY-MM-DD.');
  }

  let dueTime: string | undefined;
  while (true) {
    const dueTimeInput = await askQuestion(
      'Masukkan due time (HH:mm, optional, tekan Enter untuk skip): '
    );
    if (!dueTimeInput.trim()) {
      break;
    }
    if (isValidTime(dueTimeInput.trim())) {
      dueTime = dueTimeInput.trim();
      break;
    }
    console.log(
      'Format due time tidak valid. Gunakan format HH:mm (00-23 untuk jam, 00-59 untuk menit).'
    );
  }

  try {
    const todo = addTodo(title, priority, dueDate, dueTime);
    console.log(`To-Do berhasil ditambahkan: ${todo.title}`);
  } catch (error) {
    console.log('Error:', (error as Error).message);
  }
}

async function handleMarkComplete(): Promise<void> {
  const todos = listTodos();
  if (todos.length === 0) {
    console.log('Tidak ada To-Do untuk diselesaikan.');
    return;
  }

  displayTodos(todos);

  const idInput = await askQuestion(
    'Masukkan nomor To-Do yang ingin diselesaikan: '
  );
  const index = Number(idInput) - 1;

  if (Number.isNaN(index) || index < 0 || index >= todos.length) {
    console.log('Nomor tidak valid. Gunakan nomor dari daftar.');
    return;
  }

  try {
    const todo = markTodoAsComplete(todos[index].id);
    console.log(`To-Do selesai: ${todo.title}`);
  } catch (error) {
    console.log('Error:', (error as Error).message);
  }
}

async function handleDeleteTodo(): Promise<void> {
  const todos = listTodos();
  if (todos.length === 0) {
    console.log('Tidak ada To-Do untuk dihapus.');
    return;
  }

  displayTodos(todos);

  const idInput = await askQuestion(
    'Masukkan nomor To-Do yang ingin dihapus: '
  );
  const index = Number(idInput) - 1;

  if (Number.isNaN(index) || index < 0 || index >= todos.length) {
    console.log('Nomor tidak valid. Gunakan nomor dari daftar.');
    return;
  }

  try {
    const todo = deleteTodo(todos[index].id);
    console.log(`To-Do dihapus: ${todo.title}`);
  } catch (error) {
    console.log('Error:', (error as Error).message);
  }
}

async function handleListTodos(): Promise<void> {
  const todos = listTodos();
  displayTodos(todos);
}

async function handleSearchTodos(): Promise<void> {
  const keyword = await askQuestion('Masukkan kata kunci pencarian: ');

  if (!isValidString(keyword)) {
    console.log('Masukkan kata kunci yang valid.');
    return;
  }

  const results = searchTodos(keyword);

  if (results.length === 0) {
    console.log('Tidak ditemukan To-Do yang cocok.');
    return;
  }

  displayTodos(results);
}

async function main(): Promise<void> {
  ensureStorage();

  console.log('Welcome to TypeScript To-Do App!');
  console.log(`Waktu saat ini: ${formatDateTime(new Date())}`);

  while (true) {
    showMenu();
    const choice = (await askQuestion('Pilih menu (1-6): ')).trim();

    switch (choice) {
      case '1':
        await handleAddTodo();
        break;
      case '2':
        await handleMarkComplete();
        break;
      case '3':
        await handleDeleteTodo();
        break;
      case '4':
        await handleListTodos();
        break;
      case '5':
        await handleSearchTodos();
        break;
      case '6':
        console.log('Terima kasih. Sampai Jumpa Kembali di To-Do Lee-st!');
        rl.close();
        return;
      default:
        console.log('Pilihan tidak valid. Silakan coba lagi.');
    }
  }
}

main().catch((error) => {
  console.error('Terjadi kesalahan:', error);
  rl.close();
});
