document.addEventListener('DOMContentLoaded', ()=> {
    function onclick(selector, handler) {
        document.querySelector(selector).onclick = handler;
    }
  
    onclick('#add_inprogress', () => add_inprogress());
    onclick('.profile__button', () => click_profile());
});

function add_inprogress() {
    document.querySelector("#dd_inprogress").classList.toggle("show");    
}

function click_profile() {
    document.querySelector("#dd_user_profile").classList.toggle("show");    
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
        
        if (dropdowns[i].classList.contains('show')) {
          dropdowns[i].classList.remove('show');
        }
      }

      document.querySelector(".profile__arrow").classList.remove("profile__arrow--open");    

    }
}