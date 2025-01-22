import { State } from './model/State.js';
import { UserStorage } from './model/UserStorage.js';

export class App {
    _state = null;
    _userStorage = null;

    constructor() {
        this._state = new State();
        this._userStorage = new UserStorage();
    }

    get state() {
        return this._state;
    }

    get userStorage() {
        return this._userStorage;
    }
}