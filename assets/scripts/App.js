import { State } from './model/State.js';
import { UserStorage } from './model/UserStorage.js';
import { TaskStorage } from './model/TaskStorage.js';

export class App {
    _state = null;
    _userStorage = null;
    _taskStorage = null;

    constructor() {
        this._state = new State();
        this._userStorage = new UserStorage();
        this._taskStorage = new TaskStorage();
    }

    get state() {
        return this._state;
    }

    get userStorage() {
        return this._userStorage;
    }

    get taskStorage() {
        return this._taskStorage;
    }
}