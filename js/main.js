'use strict';

const now = new Date();
const date = document.querySelector('.todo__date')
date.innerHTML = `${now.toLocaleDateString('en-US', {weekday: 'long'})}
                    <br>
                    ${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g,'-')}`;

const todo_pending = document.querySelector('.todo__pending');
const todo_pending_list = todo_pending.querySelector('.todo__list');
const todo_completed = document.querySelector('.todo__completed');
const todo_completed_list = todo_completed.querySelector('.todo__list');
const pendingInfo = todo_pending.querySelector('.todo__info');
const completedInfo = todo_completed.querySelector('.todo__info');

document.querySelector('.todo__handler span:first-child').addEventListener('click', function(){
    todo_completed.classList.toggle('show');
    this.textContent = todo_completed.classList.contains('show')? 'Hide Completed': 'Show Completed';
});

document.querySelector('.todo__handler span:last-child').addEventListener('click', function(){
    const pending_items = todo_pending_list.querySelectorAll('.todo__item');
    if(pending_items.length>0){     // there are items in the list
        pending_items.forEach(item => deleteTodoItem(item));
    }
});

(function getTodosFromLocalStorage(){
    if(localStorage.todos){
        const todos = JSON.parse(localStorage.todos);
        todos.forEach(item => insertTodoItem(item));
    }
})();
function saveTodosToLocalStorage(){
    const pending_items = todo_pending_list.querySelectorAll('.todo__item');
    const todos = [];
    pending_items.forEach(item => todos.unshift(item.querySelector('span').textContent));
    localStorage.todos = JSON.stringify(todos);
};

function refreshInfo(){
    const pending_items = todo_pending_list.querySelectorAll('.todo__item');
    pendingInfo.textContent = `You have ${pending_items.length} pending items`;
    const completed_items = todo_completed_list.querySelectorAll('.todo__item');
    let ratio = (completed_items.length/(pending_items.length+completed_items.length)*100).toFixed(0);
    completedInfo.textContent = `Completed tasks: ${ratio==='NaN'? '': ratio}%`;
    saveTodosToLocalStorage();
};
refreshInfo();

function deleteTodoItem(item){
    item.parentElement.removeChild(item);
    refreshInfo();
};
function completeTodoItem(item){
    const completedItemHTML =   `<div class="todo__item">
                                    <span class="checked">&#10004;</span>
                                     <span class="text">${item.querySelector('span').textContent}</span>
                                </div>`;
    todo_completed_list.insertAdjacentHTML('afterbegin', completedItemHTML);
    deleteTodoItem(item);                       
}


function insertTodoItem(todo_text){
    if(todo_text.length){         // there is new todo
        const todoItemHTML =    `<div class="todo__item">
                                    <input type="checkbox">
                                    <span>${todo_text}</span>
                                    <button>&#10006;</button>
                                </div>`;
        todo_pending_list.insertAdjacentHTML('afterbegin', todoItemHTML);
        todo_pending_list.querySelector('.todo__item button').addEventListener('click', function(){
            deleteTodoItem(this.parentElement);
        });
        todo_pending_list.querySelector('.todo__item [type=checkbox]').addEventListener('click', function(){
            completeTodoItem(this.parentElement);
        });
        refreshInfo();
    }
};

document.querySelector('.todo__btn').addEventListener('click', function(){
    const todo_text = document.querySelector('.todo__text');
    insertTodoItem(todo_text.value.trim());
    todo_text.value = '';
});
