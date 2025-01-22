import { User } from './User.js';
import { getFromStorage, addToStorage } from '../utils.js';

export class UserStorage {
    getAllUsers() {
        return getFromStorage("app_users");
    }

    add(user) {
        return addToStorage(user, "app_users");
    }

    contains(user) {
        const users = this.getAllUsers();

        console.log(user);
        console.log(users);
    
        if (users != null && users.length > 0) {
          for (let item of users) {

            console.log(item);

            if (user.login == item.login && user.password == item.password) {
                console.log(true);
                return true;
            }
          }
        }
    
        console.log(false);
        return false;
    }

    ensureAdminUser() {
        localStorage.clear();

        const admin = new User("admin", "12345");

        if (!this.contains(admin)) {
            this.add(admin);
        }
    }
}