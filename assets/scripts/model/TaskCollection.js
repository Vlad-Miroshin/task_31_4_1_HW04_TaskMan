import { Task } from './Task.js';

export class TaskCollection {
    constructor() {
        this.items = [];
    }

    static _create(items) {
        const tc = new TaskCollection();

        if (items && items.length > 0) {
            for (let item in items) {
                const task = new Task();
                task.id = item.id;
                task.title = item.title;
                task.description = item.description;

                tc.add(task);
            }
        }

        return tc;
    }

    add(task) {
        this.items.push(task);
    }

    getItemsByOwner(user_id) {
        return _create(this.items.filter((item) => item.user_id === user_id));
    }

    getItemsByCategory(category_id) {
        return _create(this.items.filter((item) => item.category_id === category_id));
    }

}