import { create_UUID } from '../utils.js';

export class BaseModel {
    constructor() {
        this.id = create_UUID();
    }
}
