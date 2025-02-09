import { BaseModel } from "./BaseModel.js";

export class User extends BaseModel {
    constructor(login, password) {
        super();

        this.login = login;
        this.password = password;
    }

    getRoleId() {
        return this.role_id;
    }

    setRole(role) {
        this.setRoleId(role.id);
    }

    setRoleId(id) {
        this.role_id = id;
    }

}