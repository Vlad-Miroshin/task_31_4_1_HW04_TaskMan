import { BaseModel } from "./BaseModel.js";

export class Task extends BaseModel {
    constructor(title, description = "") {
        super();

        this.title = title;
        this.description = description;
    }

    setOwner(user) {
        this.owner_id = user.id;
    }

    setCategory(category) {
        this.setCategoryId(category.id);
    }

    setCategoryId(id) {
        this.category_id = id;
    }


}