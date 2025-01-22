export class State {
    _currentUser = null;
  
    constructor() {
        this._currentUser = null;
    }
  
    setCurrentUser(user) {
        this._currentUser = user;
    }
    
    getCurrentUser() {
        return this._currentUser;
    }

    isAuthorized() {
        return this.getCurrentUser() != null;
    }

    logout() {
        this._currentUser = null;
    }
}