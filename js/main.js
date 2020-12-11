'use strict';

// used elements
const todo = document.querySelector('.todo');

const todo_lists = todo.querySelector('.todo__lists');
const todo_nothing = todo.querySelector('.todo__nothing');

// pending
const todo_pending = todo.querySelector('.todo__pending');
const todo_pending_list = todo_pending.querySelector('.todo__list');
const pendingInfo = todo_pending.querySelector('.todo__info span');
// completed
const todo_completed = document.querySelector('.todo__completed');
const todo_completed_list = todo_completed.querySelector('.todo__list');
const completedInfo = todo_completed.querySelector('.todo__info span');

// handling localStorage
const localDB = {
    getTodosFromLocalStorage(){
        if(localStorage.todos){         // there is saved todos list
            JSON.parse(localStorage.todos)
                .forEach(item => insertTodoItem(item, false));
        }
    },
    saveTodosToLocalStorage(){
        const todos = [];
        todo_pending_list.querySelectorAll('.todo__item')
                         .forEach(item => todos.unshift(item.querySelector('span').textContent));
        localStorage.todos = JSON.stringify(todos);
    },
}
// refresh lists' info - You have pending items; Completed tasks;
const doRefresh = {
    pending(){
        const pending_items = todo_pending_list.querySelectorAll('.todo__item');
        pendingInfo.textContent = pending_items.length;
    },
    completed(){
        const completed_items = todo_completed_list.querySelectorAll('.todo__item');
        const pending_items = todo_pending_list.querySelectorAll('.todo__item');
        let ratio = (completed_items.length/(pending_items.length+completed_items.length)*100).toFixed(0);
        completedInfo.textContent = `${ratio==='NaN'? '': ratio}`;
    },
}
function refreshPage(){
    doRefresh.pending();                // pending info
    doRefresh.completed();              // completed info
    localDB.saveTodosToLocalStorage();  // save pending todos

    // pendingInfo.textContent => number of pending todo
    if(pendingInfo.textContent==='0'){  // no pending
        setTimeout(() => {              // not immediately :)
            todo_lists.classList.remove('show');
            todo_nothing.classList.add('show');
        }, 500);
    } else {
        todo_lists.classList.add('show');
        todo_nothing.classList.remove('show')
    }
};

// read todos list
localDB.getTodosFromLocalStorage();
// display stat info
refreshPage();

// actual date
const now = new Date();
todo.querySelector('.todo__date')
    .innerHTML = `${now.toLocaleDateString('en-US', {weekday: 'long'})}
        <br>
        ${now.toLocaleDateString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'}).replace(/\//g,'-')}`;

// Hide/Show, button's eventhandlers
todo.querySelector('.todo__handler span:first-child').addEventListener('click', function(){
    todo_completed.classList.toggle('show');
    this.textContent = todo_completed.classList.contains('show')? 'Hide Completed': 'Show Completed';
});
// Clear button's eventhandlers
todo.querySelector('.todo__handler span:last-child').addEventListener('click', function(){
    const pending_items = todo_pending_list.querySelectorAll('.todo__item');
    if(pending_items.length>0){     // there are items in the list
        pending_items.forEach(item => deleteTodoItem(item));
    }
});

// delete
function deleteTodoItem(item){
    item.parentElement.removeChild(item);
    refreshPage();
};
// complete
function completeTodoItem(item){
    const completedItemHTML =   `<div class="todo__item">
                                    <span class="checked">&#10004;</span>
                                     <span class="text">${item.querySelector('span').textContent}</span>
                                </div>`;
    todo_completed_list.insertAdjacentHTML('afterbegin', completedItemHTML);
    deleteTodoItem(item);                       
}
// insert new todo item into todo-list
function insertTodoItem(todo_text, animation=true){
    if(todo_text.length){         // there is new todo
        const todoItemHTML =    `<div class="todo__item todo__item--right">
                                    <input type="checkbox">
                                    <span>${todo_text}</span>
                                    <button>&#10006;</button>
                                </div>`;
        todo_pending_list.insertAdjacentHTML('afterbegin', todoItemHTML);   // it will be the first child
        const todo_item = todo_pending_list.querySelector('.todo__item:first-child');
        if(animation){
            setTimeout(() => todo_item.classList.remove('todo__item--right'), 0);
        } else {
            todo_item.classList.remove('todo__item--right');
        }
        todo_item.querySelector('button').addEventListener('click', function(){
            deleteTodoItem(this.parentElement);
        });
        todo_item.querySelector('[type=checkbox]').addEventListener('click', function(){
            completeTodoItem(this.parentElement);
        });
        refreshPage();
    }
};
// handle new todo item
document.querySelector('.todo__btn').addEventListener('click', function(){
    const todo_text = document.querySelector('.todo__text');
    insertTodoItem(todo_text.value.trim());
    todo_text.value = '';
});
