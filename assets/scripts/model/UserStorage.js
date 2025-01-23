import { User } from './User.js';
import { getFromStorage, addToStorage } from '../utils.js';

const KEY = "app_users";

export class UserStorage {
    getAllUsers() {
        return getFromStorage(KEY);
    }

    add(user) {
        return addToStorage(user, KEY);
    }

    getUserByCredentials(login, password) {
        const users = this.getAllUsers();

        if (users != null && users.length > 0) {
          for (let item of users) {
            if (item.login === login && item.password === password) {
                return item;
            }
          }
        }
    
        return null;
    }

    ensureAdminUser() {
        //localStorage.clear();

        const admin = new User("admin", "12345");

        if (!this.getUserByCredentials(admin.login, admin.password)) {
            this.add(admin);
        }
    }

    login(user) {
        document.cookie = `auth_user_id=${user.id}; expires=Sun, 16 Jul 3567 06:23:41 GMT`;
    }
      
    logout(user) {
        document.cookie = `auth_user_id=${user.id}; max-age=0`;
    }

    getAuthUserId() {
        return document.cookie.replace(
            /(?:(?:^|.*;\s*)auth_user_id\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
    }

    getUserById(id) {
        const users = this.getAllUsers();
        if (users != null && users.length > 0) {
          for (let item of users) {
            if (item.id === id) {
                return item;
            }
          }
        }
    
        return null;
    }

}