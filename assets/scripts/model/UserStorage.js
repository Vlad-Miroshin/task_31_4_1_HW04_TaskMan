import { User } from './User.js';
import { UserRole } from './UserRole.js';
import { getFromStorage, addToStorage, saveToStorage } from '../utils.js';

const KEY = "app_users";

export class UserStorage {
    getAllUsers() {
        const items = getFromStorage(KEY);

        return items.map(function(item) {
            const user = new User(item.login, item.password);
            user.id = item.id;
            user.role_id = item.role_id;

            return user;
        });

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

    existsLogin(login) {
        const users = this.getAllUsers();

        if (users != null && users.length > 0) {
          for (let item of users) {
            if (item.login === login) {
                return true;
            }
          }
        }
    
        return false;
    }

    ensureAdminUser() {
        //localStorage.clear();

        const admin = new User("admin", "12345");
        admin.setRole(UserRole.Admin);

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

    _getIndexById(user_array, id) {
        if (user_array && user_array.length > 0) {
            for (let i = 0; i < user_array.length; i++) {
              if (user_array[i].id == id) {
                  return i;
              }
            }
        }

        return  -1;
    }

    getUserById(id) {
        const users = this.getAllUsers();
        const index = this._getIndexById(users, id);

        if (index >= 0) {
            return users[index];
        } else {
            return null;
        }
    }

    delete(user) {
        const users = this.getAllUsers();
        const index = this._getIndexById(users, user.id);

        if (index >= 0) {
            users.splice(index, 1);

            saveToStorage(users, KEY);
        }
    }    

}