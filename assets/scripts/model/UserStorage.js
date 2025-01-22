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

    contains(user) {
        const users = this.getAllUsers();

        if (users != null && users.length > 0) {
          for (let item of users) {

            if (user.login == item.login && user.password == item.password) {
                return true;
            }
          }
        }
    
        return false;
    }

    ensureAdminUser() {
        //localStorage.clear();

        const admin = new User("admin", "12345");

        if (!this.contains(admin)) {
            this.add(admin);
        }
    }

    setAuthUser(user_id) {
        document.cookie = `auth_user_id=${user_id}; expires=Sun, 16 Jul 3567 06:23:41 GMT`;
    }
      
    getAuthUserId() {
        return document.cookie.replace(
            /(?:(?:^|.*;\s*)auth_user_id\s*\=\s*([^;]*).*$)|^.*$/,
            "$1",
        );
    }
      
}