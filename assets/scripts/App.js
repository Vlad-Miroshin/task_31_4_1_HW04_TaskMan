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

    logout() {
        const currentUser = this.state.getCurrentUser();
        if (currentUser) {
            this.userStorage.logout(currentUser);
        }
        
        this.state.logout();
    }

    login(user) {
        this.state.login(user);
        this.userStorage.login(user);
    }

    isAuthorized() {
        return this.state.isAuthorized();
    }

    isAdmin() {
        return this.state.isAdmin();
    }

    tryRestoreCurrentUser() {
        const user_id = this.userStorage.getAuthUserId();
        
        if (user_id) {
            const user = this.userStorage.getUserById(user_id);
            if (user) {
                this.login(user);
            }
        }
    }
}