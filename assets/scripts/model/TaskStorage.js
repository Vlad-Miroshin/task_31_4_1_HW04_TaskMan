import { Task } from './Task.js';
import { getFromStorage, addToStorage, saveToStorage } from '../utils.js';

const KEY = "app_tasks";

export class TaskStorage {
    KEY = "";

    getAllTask() {
        return getFromStorage(KEY);
    }

    create(task) {
        return addToStorage(task, KEY);
    }

    _getIndexById(task_array, id) {
        if (task_array && task_array.length > 0) {
            for (let i = 0; i < task_array.length; i++) {
              if (task_array[i].id == id) {
                  return i;
              }
            }
        }

        return  -1;
    }

    update(task) {
        const tasks = this.getAllTasks();
        const index = _getIndexById(tasks, task.id);

        if (index >= 0) {
            tasks[index].title = task.title;
            tasks[index].description = task.description;
            tasks[index].owner_id = task.owner_id;
            tasks[index].category_id = task.category_id;

            saveToStorage(tasks, KEY);
        }
    }

    delete(task) {
        const tasks = this.getAllTasks();
        const index = _getIndexById(tasks, task.id);

        if (index >= 0) {
            const result = tasks.splice(index, 1);

            saveToStorage(result, KEY);
        }
    }
}