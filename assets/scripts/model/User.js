import { BaseModel } from "./BaseModel.js";

export class User extends BaseModel {
    constructor(login, password) {
        super();

        this.login = login;
        this.password = password;
    }
}