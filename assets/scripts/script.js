import { App } from './App.js';
import { Category } from './model/Category.js';
import { Task } from './model/Task.js';
import { User } from './model/User.js';
import { UserRole } from './model/UserRole.js';


// application

const app = new App();

app.userStorage.ensureAdminUser(); // admin 12345
app.taskStorage.ensureDefaultTask(); // Тестовая задача


// init event listeners

document.addEventListener('DOMContentLoaded', ()=> {
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }
  
    onclick('#add_inprogress', () => add_inprogress());
    onclick('#add_ready', () => add_ready());
    onclick('#add_finished', () => add_finished());
    onclick('.profile__button', () => click_profile());
    onclick('#new_card_btn', () => handle_new_card());
    onclick('.task_prop__close-btn', () => update_card_close());

    document.querySelector(".login__form").addEventListener("submit", (e) => login_submit(e));
    document.querySelector("#new_card").addEventListener("submit", (e) => new_card_submit(e));
    document.querySelector("#update_card").addEventListener("submit", (e) => update_card_submit(e));
    document.querySelector(".user__form").addEventListener("submit", (e) => user_submit(e));
    

    const workplaceGroups = document.querySelectorAll(".workplace__group");
    workplaceGroups.forEach((item) => {
      item.addEventListener("dragenter", (e) => handle_drag_enter(e));
      item.addEventListener("dragover", (e) => handle_drag_over(e));
    });

    document.querySelector("#workplace_group_backlog").addEventListener("drop", (e) => handle_drop(e, Category.Backlog));
    document.querySelector("#workplace_group_ready").addEventListener("drop", (e) => handle_drop(e, Category.Ready));
    document.querySelector("#workplace_group_inProgress").addEventListener("drop", (e) => handle_drop(e, Category.InProgress));
    document.querySelector("#workplace_group_finished").addEventListener("drop", (e) => handle_drop(e, Category.Finished));
});

function add_inprogress() {
  document.querySelector("#dd_inprogress").classList.toggle("dropdown-show");    
}

function add_ready() {
  document.querySelector("#dd_ready").classList.toggle("dropdown-show");    
}

function add_finished() {
  document.querySelector("#dd_finished").classList.toggle("dropdown-show");    
}

function click_profile() {
  document.querySelector("#dd_user_profile").classList.toggle("dropdown-show");    
  document.querySelector(".profile__arrow").classList.toggle("profile__arrow--open");    
}
  
  // Закрыть раскрывающийся список, если пользователь щелкнет за его пределами.
window.onclick = function(event) {
    if (!event.target.matches('.task_button') &&
        !event.target.matches('.profile__icon') &&
        !event.target.matches('.profile__arrow') 
      ) 
    {
      const dropdowns = document.querySelectorAll(".dropdown-content");
      
      for (let i = 0; i < dropdowns.length; i++) {
        
        if (dropdowns[i].classList.contains('dropdown-show')) {
          dropdowns[i].classList.remove('dropdown-show');
        }
      }

      document.querySelector(".profile__arrow").classList.remove("profile__arrow--open");    

    }
}

// views

const part_profile = document.querySelector(".part__profile");
const part_login = document.querySelector(".part__login");
const part_workplace = document.querySelector(".part__workplace");
const part_task = document.querySelector(".part__task");
const part_summary = document.querySelector(".part__summary");
const part_users = document.querySelector(".part__users");

const parts = [part_profile, part_login, part_workplace, part_task, part_summary, part_users];

// пробуем восстановить текущего пользователя
app.tryRestoreCurrentUser(); 

// внешний вид приложения
create_view_app();

// events

function login_submit(e) {
  e.preventDefault();

  const login = document.querySelector("#login__username").value;
  const password = document.querySelector("#login__password").value;
  const failure = document.querySelector(".login__failure");

  const user = app.userStorage.getUserByCredentials(login, password);
  
  if (user) {
    
    hide(failure);
    app.login(user);

    create_view("tasks");

  } else {
    
    app.logout();
    failure.innerText = "Недопустимое имя пользователя или пароль";
    show(failure);

  }
};

function profile_logout() {
  app.logout();

  const username = document.querySelector("#login__username");
  if (username)
    username.value = "";

  const password = document.querySelector("#login__password");
  if (password)
    password.value = "";

  create_view("login");
}

function profile_users() {
  create_view("profile_users");
}

function profile_tasks() {
  create_view("tasks");
}

// funcs

function create_view(name) {
  hide_all();

  create_user_profile_menu();

  if (name === "login") {
    create_view_login();
  } else if (name === "profile_users") {
    create_view_users();
  } else if (name === "tasks") {
    create_view_tasks();
  } else if (name === "task_item") {
    create_view_update_card();
  }
}

function show(elem) {
  elem.classList.remove("hidden");
}

function hide(elem) {
  elem.classList.add("hidden");
}

function hide_all() {
  parts.forEach((part) => {
    hide(part);
  });
}

function removeAllChields(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}


// views

function create_view_app() {
  if (!app.isAuthorized()) {
    create_view("login");
  } else {
    create_view("tasks");
  }
}

function create_view_login() {
  show(part_login);
}

function create_view_tasks() {
  show(part_profile);
  show(part_workplace);
  show(part_summary);

  let tasks = null;
  if (app.state.isAdmin()) {
    tasks = app.taskStorage.getAllTasks();
  } else {
    tasks = app.taskStorage.getTasksByOwner(app.state.getCurrentUser());
  }

  const backlog = app.taskStorage.getTasks(tasks, Category.Backlog);
  const ready = app.taskStorage.getTasks(tasks, Category.Ready);
  const inProgress = app.taskStorage.getTasks(tasks, Category.InProgress);
  const finished = app.taskStorage.getTasks(tasks, Category.Finished);

  create_card_items(backlog, "#group_backlog");
  create_drop_items(backlog, "#dd_ready", "#add_ready", Category.Ready);
  create_drop_items(ready, "#dd_inprogress", "#add_inprogress", Category.InProgress);
  create_drop_items(inProgress, "#dd_finished", "add_finished", Category.Finished);

  create_card_items(ready, "#group_ready");
  create_card_items(inProgress, "#group_inprogress");
  create_card_items(finished, "#group_finished");

  showSummary(ready.length + inProgress.length, finished.length);

}

function showSummary(actCount, finishedCount) {
  const element_active = document.querySelector(".summary_inprogress");
  const element_finished = document.querySelector(".summary_finished");
  const element_user = document.querySelector(".summary_user");

  element_active.innerText = `Активных задач: ${actCount > 0 ? actCount : "нет"}`;
  element_finished.innerText = `Завершённых: ${finishedCount > 0 ? finishedCount : "нет"}`;

  if (app.state.isAuthorized()) {
    element_user.innerText = `Задачи пользователя: ${app.state.getCurrentUser().login}`;
  } else {
    element_user.innerText = "";
  }
}

function create_user_profile_menu() {
  const root = document.querySelector("#dd_user_profile");
  removeAllChields(root);

  if (app.isAdmin()) {
    add_user_profile_menu_item(root, "Пользователи", profile_users);
  }

  add_user_profile_menu_item(root, "Задачи", profile_tasks);
  add_user_profile_menu_item(root, "Выйти", profile_logout);
}

function add_user_profile_menu_item(root, caption, handler_click) {
  const a = document.createElement("a");
  a.innerText = caption;
  a.href = "#";
  a.onclick = handler_click;

  root.appendChild(a);
}





function create_card_items(items, groupSelector, dropDownSelector = "") {
  
  // группа
  const group = document.querySelector(groupSelector);
  removeAllChields(group);

  if (items && items.length > 0) {
    for (let tsk of items) {

      const a = document.createElement("a");
      a.innerText = tsk.title;
      a.href = "#";
      a.setAttribute("data-id", tsk.id)
      a.draggable = true;
      a.addEventListener("click", (e) => handle_card_click(e));
      a.addEventListener("dragstart", (e) => handle_drag_start(e));
      a.addEventListener("dragend", (e) => handle_drag_end(e));
      
      const li = document.createElement("li");
      li.className = "task_item";
      li.appendChild(a);

      group.appendChild(li);
    }
  }
}

function create_drop_items(items, dropDownSelector, buttonSelector, targetCategory) {

  // меню "Добавить задачу"
  const dropDown = document.querySelector(dropDownSelector);
  removeAllChields(dropDown);


  const dropDownButton = document.querySelector(buttonSelector);
  
  if (items && items.length > 0) {
    for (let tsk of items) {

      const a = document.createElement("a");
        a.innerText = tsk.title;
        a.href = "#";
        a.setAttribute("data-id", tsk.id)
        a.setAttribute("data-target-id", targetCategory.id)
        a.addEventListener("click", (e) => handle_takeover_card_click(e));

        dropDown.appendChild(a);
      }

      if (dropDownButton)
        dropDownButton.classList.remove("task_button--disabled");

    } else {

      // console.log(dropDown.closest("div").closest("div"));
      // console.log(dropDownButton);

      if (dropDownButton)
        dropDownButton.classList.add("task_button--disabled");
    }
}

function handle_new_card() {
  const btn = document.querySelector("#new_card_btn");
  const form = document.querySelector("#new_card");
  hide(btn);
  show(form);
}

function new_card_submit(e) {
  e.preventDefault();

  const btn = document.querySelector("#new_card_btn");
  const form = document.querySelector("#new_card");
  const title = document.querySelector("#new_card_title").value;

  if (title) {
    const task = new Task(title);
    task.setCategory(Category.Backlog);
    task.setOwner(app.state.getCurrentUser());

    app.taskStorage.create(task);
  }

  hide(form);
  show(btn);

  create_view_tasks();
}


function handle_card_click(e) {
  e.preventDefault();

  const task_id = e.target.getAttribute("data-id");
  const task = app.taskStorage.getItemById(task_id);
  if (task) {
    app.state.setCurrentTask(task);
    create_view("task_item");
  }
}

function handle_takeover_card_click(e) {
  e.preventDefault();

  const task_id = e.target.getAttribute("data-id");
  const target_id = e.target.getAttribute("data-target-id");

  const task = app.taskStorage.getItemById(task_id);
  if (task) {

    task.setCategoryId(target_id);
    app.taskStorage.update(task);

    create_view("tasks");
  }
}

function handle_drag_start(e) {
  const id = e.target.getAttribute("data-id");
  e.dataTransfer.setData("application/x.bookmark", id);
}

function handle_drag_end(e) {

//console.log(e);
}


function handle_drag_over(e) {
  e.preventDefault();

}

function handle_drag_enter(e) {
  e.preventDefault();

}

function handle_drop(e, category) {
  e.preventDefault();

  const id = e.dataTransfer.getData("application/x.bookmark");

  const task = app.taskStorage.getItemById(id);
  if (task) {
    task.setCategory(category);
    app.taskStorage.update(task);

    create_view_tasks();
  }
}

// views 

function create_view_update_card() {
  show(part_task);

  const task = app.state.getCurrentTask();

  if (task) {
    document.querySelector("#update_card_title").value = task.title;
    document.querySelector("#update_card_description").value = task.description;
    document.querySelector("#update_card_delete").checked = false;
  }
}

function update_card_close() {
  create_view_app();
}

function update_card_submit(e) {
  e.preventDefault();

  const task = app.state.getCurrentTask();

  if (task) {
    task.title = document.querySelector("#update_card_title").value;
    task.description = document.querySelector("#update_card_description").value;

    const is_delete = document.querySelector("#update_card_delete").checked;

    if (is_delete) {
      app.taskStorage.delete(task);
    } else {
      app.taskStorage.update(task);
    }
  }

  create_view_app();
}

function create_view_users() {
  show(part_profile);
  show(part_users);

  create_registered_users();
}

function create_registered_users() {
  const root = document.querySelector(".user_list__items");

  removeAllChields(root);

  const allUsers = app.userStorage.getAllUsers();

  if (allUsers && allUsers.length > 0) {
    for (let user of allUsers) {
      add_user(root, user);
    }
  }
}

function add_user(elem, user) {
  const div = document.createElement("div");
  div.innerText = `${user.login} (${UserRole.getName(user.getRoleId())})`;

  const button = document.createElement("button");
  button.className = "user_list__button";
  button.innerText = "Удалить";
  button.setAttribute("data-id", user.id);
  button.onclick = delete_user;
        
  const li = document.createElement("li");
  li.className = "user_list__item";
  li.appendChild(div);
  li.appendChild(button);

  elem.appendChild(li);
}

function delete_user(e) {
  const user_id = e.target.getAttribute("data-id");

  const user = app.userStorage.getUserById(user_id);
  if (user) {
    app.userStorage.delete(user);
    create_registered_users();  
  }
}

function user_submit(e) {
  e.preventDefault();

  const login = document.querySelector("#user_login").value;
  const password = document.querySelector("#user_password").value;
  const role = document.querySelector("#user_role").value;
  const failure = document.querySelector(".user__failure");

  const newUser = new User(login, password);
  newUser.setRoleId(role);

  const err = checkupNewUser(newUser);

  if (err) {
    failure.innerText = err;
    show(failure);
  } else {
    hide(failure);
    app.userStorage.add(newUser);

    const root = document.querySelector(".user_list__items");
    add_user(root, newUser);
  }
};

function checkupNewUser(user) {
  if (!user.login || user.login === "") {
    return "Укажите имя учётной записи";
  }

  if (!user.password || user.password === "") {
    return "Укажите пароль";
  }

  const existsUser = app.userStorage.existsLogin(user.login);
  if (existsUser) {
    return "Учётная запись уже существует";
  }

  return null;
}
