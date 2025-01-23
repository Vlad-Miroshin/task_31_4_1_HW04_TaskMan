import { Task } from './Task.js';
import { getFromStorage, addToStorage, saveToStorage } from '../utils.js';
import { Category } from './Category.js';

const KEY = "app_tasks";

export class TaskStorage {

    getAllTasks() {
        const items = getFromStorage(KEY);
        return items.map(function(item){
            const task = new Task(item.title, item.description);
            task.id = item.id;
            task.category_id = item.category_id;
            task.owner_id = item.owner_id;

            return task;
        });
    }

    getTasksByOwner(user) {
        return this.getAllTasks().filter(item => item.owner_id === user.id);
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

    getItemById(id) {
        const tasks = this.getAllTasks();

        if (tasks && tasks.length > 0) {
            for (let item of tasks) {
              if (item.id === id) {
                  return item;
              }
            }
        }

        return  null;
    }

    update(task) {
        const tasks = this.getAllTasks();
        const index = this._getIndexById(tasks, task.id);

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
        const index = this._getIndexById(tasks, task.id);

        if (index >= 0) {
            tasks.splice(index, 1);

            saveToStorage(tasks, KEY);
        }
    }

    getTasks(tasks, category) {
        if (tasks && tasks.length > 0) {
            return tasks.filter(item => item.category_id === category.id);
        }

        return null;
    }

    ensureDefaultTask() {
        const tasks = this.getAllTasks();

        if (!tasks || tasks.length === 0) {
            const dummy = new Task("Тестовая задача");
            dummy.setCategory(Category.Backlog);

            this.create(dummy);           
        }
    }
}