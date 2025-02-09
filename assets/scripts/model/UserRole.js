export class UserRole {
    constructor(id, name= "") {
        this.id = id;
        this.name = name;
    }

    static Admin = new UserRole("Admin", "Администратор");
    static User = new UserRole("User", "Пользователь");

    static getName(id) {
        if (id === 'Admin')
            return "Администратор";
        else if (id === 'User')
            return "Пользователь";
        else
            return id;
    }
}