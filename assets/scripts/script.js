import { App } from './App.js';
import { Category } from './model/Category.js';
import { Task } from './model/Task.js';


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
    onclick('.profile__button', () => click_profile());
    onclick('#profile_logout', () => profile_logout());
    onclick('#new_card_btn', () => handle_new_card());
    onclick('.task_prop__close-btn', () => update_card_close());

    document.querySelector(".login__form").addEventListener("submit", (e) => login_submit(e));
    document.querySelector("#new_card").addEventListener("submit", (e) => new_card_submit(e));
    document.querySelector("#update_card").addEventListener("submit", (e) => update_card_submit(e));
});

function add_inprogress() {
  document.querySelector("#dd_inprogress").classList.toggle("dropdown-show");    
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

const parts = [part_profile, part_login, part_workplace, part_task, part_summary];

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
  create_view("login");
}


// funcs

function create_view(name) {
  hide_all();

  if (name === "login") {
    create_view_login();
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

function removeAllChilds(parent) {
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

  if (backlog) {
    const ul_backlog = document.querySelector("#group_backlog");
    removeAllChilds(ul_backlog);

    for (let tsk of backlog) {
  
      const a = document.createElement("a");
      a.innerText = tsk.title;
      a.href = "#";
      a.setAttribute("data-id", tsk.id)
      a.addEventListener("click", (e) => handle_task_click(e));
      
      const li = document.createElement("li");
      li.className = "task_item";
      li.appendChild(a);
  
      ul_backlog.appendChild(li);
    }
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
  
function handle_task_click(e) {
  e.preventDefault();

  const task_id = e.target.getAttribute("data-id");
  const task = app.taskStorage.getItemById(task_id);
  if (task) {
    app.state.setCurrentTask(task);
    create_view("task_item");
  }
}

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
