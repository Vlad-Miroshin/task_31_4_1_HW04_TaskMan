import { App } from './App.js';
import { User } from './model/User.js';


// application

const app = new App();

app.userStorage.ensureAdminUser(); // admin 12345


// init event listeners

document.addEventListener('DOMContentLoaded', ()=> {
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }
  
    onclick('#add_inprogress', () => add_inprogress());
    onclick('.profile__button', () => click_profile());
    onclick('#profile_logout', () => profile_logout());

    document.querySelector(".login__form").addEventListener("submit", (e) => login_submit(e));
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
const part__workplace = document.querySelector(".part__workplace");
const part__task = document.querySelector(".part__task");
const part__summary = document.querySelector(".part__summary");

const parts = [part_profile, part_login, part__workplace, part__task, part__summary];




create_view("login");

// events

function login_submit(e) {
 
  e.preventDefault();

  const login = document.querySelector("#login__username").value;
  const password = document.querySelector("#login__password").value;
  const failure = document.querySelector(".login__failure");

  const user = new User(login, password);
  
  if (app.userStorage.contains(user)) {
    
    hide(failure);
    app.state.setCurrentUser(user);

    create_view("logged");

  } else {
    
    failure.innerText = "Недопустимое имя пользователя или пароль";
    show(failure);

  }
};

function profile_logout() {
  app.state.logout();
  create_view("login");
}


// funcs

function create_view(name) {
  hide_all();

  if (name === "login") {
    create_view_login();
  } else if (name === "logged") {
    create_view_logged();
  }
}

function create_view_login() {
  show(part_login);
}

function create_view_logged() {
  show(part_profile);
  show(part__workplace);
  show(part__summary);
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



