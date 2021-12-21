const todoForm = document.getElementById("form-todo");
const author = document.getElementById("author");
const post = document.getElementById("post");
const numTodo = document.querySelector('.todo__count');

const list = document.querySelector(".todo__list");

const base = {
  employee: "Петров Сергей Иванович",
  todo: getTodoLS(),
  check(id) {
    for (let i = 0; i < base.todo.length; i++) {
      if (base.todo[i].id === id) {
        base.todo[i].ready = true
      }
    }
  },
  addTodo(author, post) {
    const todo = {
      id: "td" + (Date.now()),
      author,
      post,
      ready: false,
    };

    base.todo.push(todo);
    return todo;
  },
  removeTodo(id) {
    for (let i = 0; i < base.todo.length; i++) {
      if (base.todo[i].id === id) {
        base.todo.splice(i, 1)
      }
    }
  },
};

function addTodo(event) {
  event.preventDefault();
  const authorText = author.value;
  const postText = post.value;

  const objTodo = base.addTodo(authorText, postText)
  const todoLi = createTodo(objTodo)
  list.append(todoLi)
  setTodoLS()
  todoForm.reset();
}

function createTodo(objTodo) {
  const todoItem = `
    <article class="post ${objTodo.ready ? 'post_complete' : ''}">
        <h3 class="post__author">${objTodo.author}</h3>
        <p class="post__todo">${objTodo.post}</p>
        ${!objTodo.ready ?
    `<button 
              class="post__ready" 
              type="button"
              data-id="${objTodo.id}"
              >✔</button>` :
    `<button 
              class="post__close" 
              type="button"
              data-id="${objTodo.id}"
              >X</button>`
  }
    </article>
  `;

  const li = document.createElement("li");
  li.classList.add("todo__list-item");
  li.innerHTML = todoItem;
  numTodo.textContent = base.todo.length.toString()
  return li
}

function renderTodo() {
  for (let i = 0; i < base.todo.length; i++) {
    const todoLi = createTodo(base.todo[i]);
    list.append(todoLi);
  }
  numTodo.textContent = base.todo.length.toString()
}

function checkTodo(event) {
  const btn = event.target.closest('.post__ready')
  if (btn) {
    const post = btn.closest('.post')
    btn.remove()
    post.classList.add('post_complete')
    const id = btn.dataset.id
    base.check(id)
    setTodoLS()
    post.innerHTML += `<button 
              class="post__close" 
              type="button"
              data-id="${id}"
              >X</button>`
  }

  const btnClose = event.target.closest('.post__close')
  if (btnClose) {
    //удаляем запись
    const id = btnClose.dataset.id
    base.removeTodo(id)
    const post = btnClose.closest('.post')
    post.remove()
    setTodoLS()
    numTodo.textContent = base.todo.length.toString()
  }
}

function getTodoLS() {
  if (localStorage.getItem('todo')) {
    return JSON.parse(localStorage.getItem('todo'))
  }
  return []
}

function setTodoLS() {
  localStorage.setItem('todo', JSON.stringify(base.todo))
}

renderTodo();

todoForm.addEventListener("submit", addTodo);
list.addEventListener('click', checkTodo);
