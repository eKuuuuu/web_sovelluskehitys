// t1.js
const todoList = [
    { id: 1, task: 'Learn HTML', completed: true },
    { id: 2, task: 'Learn CSS', completed: true },
    { id: 3, task: 'Learn JS', completed: false },
    { id: 4, task: 'Learn TypeScript', completed: false },
    { id: 5, task: 'Learn React', completed: false },
];

const ul = document.querySelector('ul');

function renderTodoList() {
    ul.innerHTML = '';
    todoList.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" id="task-${item.id}" ${item.completed ? 'checked' : ''}/>
            <label for="task-${item.id}">${item.task}</label>
            <button class="delete-btn">Delete</button>
        `;
        ul.appendChild(li);

        // Event listener for checkbox
        li.querySelector('input').addEventListener('change', function () {
            todoList[index].completed = this.checked;
            console.log(todoList);
        });

        // Event listener for delete button
        li.querySelector('.delete-btn').addEventListener('click', function () {
            todoList.splice(index, 1);
            renderTodoList();
            console.log(todoList);
        });
    });
}

renderTodoList();

const addItemBtn = document.getElementById('add-item-btn');
const modal = document.getElementById('modal');
const addItemForm = document.getElementById('add-item-form');

addItemBtn.addEventListener('click', () => {
    modal.showModal();
});

addItemForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const newTask = document.getElementById('new-task').value;
    const newItem = {
        id: todoList.length + 1,
        task: newTask,
        completed: false,
    };
    todoList.push(newItem);
    renderTodoList();
    console.log(todoList);
    modal.close();
});