// Backlog (задачи, которые требуют уточнения перед тем, как брать их в работу);
// Ready (задачи, которые могут быть взяты в работу);
// In progress (задачи, которые уже в работе);
// Finished (законченные задачи).

export class Category {
    constructor(id, name= "") {
        this.id = id;
        this.name = name;
    }

    static Backlog() {
        return new Category("Backlog");
    }

    static Ready() {
        return new Category("Ready");
    }

    static InProgress() {
        return new Category("InProgress");
    }

    static Finished() {
        return new Category("Finished");
    }
}