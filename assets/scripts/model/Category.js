export class Category {
    constructor(id, name= "") {
        this.id = id;
        this.name = name;
    }

    static Backlog = new Category("Backlog", "Требуют уточнения");
    static Ready = new Category("Ready", "К исполнению");
    static InProgress = new Category("InProgress", "В работе");
    static Finished = new Category("Finished", "Завершены");
}