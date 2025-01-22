import { BaseModel } from "./BaseModel.js";

export class Task extends BaseModel {
    constructor(title, description = "") {
        super();

        this.title = title;
        this.description = description;
    }

    setOwner(user) {
        this.user_id = user.id;
    }

    setCategory(category) {
        this.category_id = category.id;
    }
}