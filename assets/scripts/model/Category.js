// Backlog (задачи, которые требуют уточнения перед тем, как брать их в работу);
// Ready (задачи, которые могут быть взяты в работу);
// In progress (задачи, которые уже в работе);
// Finished (законченные задачи).

export class Category {
    constructor(id, name= "") {
        this.id = id;
        this.name = name;
    }

    static Backlog = new Category("Backlog", "Требуют уточнения");

    static Ready() {
        return new Category("Ready", "К исполнению");
    }

    static InProgress() {
        return new Category("InProgress", "В работе");
    }

    static Finished() {
        return new Category("Finished", "Завершены");
    }
}