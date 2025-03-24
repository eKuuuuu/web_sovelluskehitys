// array for todo list
const todoList = [
  {
    id: 1,
    task: 'Learn HTML',
    completed: true,
  },
  {
    id: 2,
    task: 'Learn CSS',
    completed: true,
  },
  {
    id: 3,
    task: 'Learn JS',
    completed: false,
  },
  {
    id: 4,
    task: 'Learn TypeScript',
    completed: false,
  },
  {
    id: 5,
    task: 'Learn React',
    completed: false,
  },
];


// add your code here
for (let i = 0; i < todoList.length; i++) {
  const li = document.createElement('li');
  const input = document.createElement('input');
    input.type = 'checkbox';
    input.id = todoList[i].id;
    input.checked = todoList[i].completed;
    const label = document.createElement('label');
    label.htmlFor = todoList[i].id;
    label.textContent = todoList[i].task;
    li.appendChild(input);
    li.appendChild(label);
    document.querySelector('ul').appendChild(li);
}
