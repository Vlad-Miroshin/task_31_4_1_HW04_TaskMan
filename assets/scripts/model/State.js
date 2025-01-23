export class State {
    _currentUser = null;
    _currentTask = null;
  
    constructor() {
        this._currentUser = null;
        this._currentTask = null;
    }
  
    login(user) {
        this._currentUser = user;
    }
    
    getCurrentUser() {
        return this._currentUser;
    }

    isAuthorized() {
        return this.getCurrentUser() != null;
    }

    isAdmin() {
        return this.isAuthorized() && this.getCurrentUser().login === "admin";
    }

    logout() {
        this._currentUser = null;
    }

    setCurrentTask(task) {
        this._currentTask = task;
    }
    
    getCurrentTask() {
        return this._currentTask;
    }

}