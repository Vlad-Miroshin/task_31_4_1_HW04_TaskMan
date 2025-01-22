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


let current_part = part_login;

show_current_part();

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
    console.log(login, password);

  } else {
    
    failure.innerText = "Недопустимое имя пользователя или пароль";
    show(failure);

  }
};



// funcs

function show_current_part() {
  hide_all();

  if (current_part) {
    show(current_part);
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

