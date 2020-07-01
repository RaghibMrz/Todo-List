const classNames = {
  TODO_ITEM: "todo-container",
  TODO_CHECKBOX: "todo-checkbox",
  TODO_TEXT: "todo-text",
  TODO_DELETE: "todo-delete",
};

let id = 0;
const list = document.getElementById("todo-list");
const itemCountSpan = document.getElementById("item-count");
const uncheckedCountSpan = document.getElementById("unchecked-count");

class TodoList {
  constructor() {
    this.listOfTodos = [];
    this.numberChecked = 0;
  }

  mkTodo() {
    const todoText = prompt("Enter action");
    if (todoText === null) {
      return;
    }
    const todo = new Todo(id++, this.getTotalCount() + 1, todoText, false);
    this.listOfTodos.push(todo);
    list.appendChild(todo.container);
  }

  getTotalCount() {
    return this.listOfTodos.length;
  }

  updateCheckCount() {
    let checkboxes = document.querySelectorAll(
      'input[type="checkbox"]:checked'
    );
    this.numberChecked = checkboxes.length;
    this.updateTodoList();
  }

  updateTodoList() {
    itemCountSpan.innerHTML = this.getTotalCount();
    uncheckedCountSpan.innerText = this.getTotalCount() - this.numberChecked;
  }

  deleteTodo(todoObj, fix) {
    console.log(this.listOfTodos.length);
    this.listOfTodos = this.listOfTodos.filter(
      (todo) => todo.id !== todoObj.id
    );
    console.log(this.listOfTodos.length);
    list.removeChild(todoObj.container);
    this.updateTodoList();

    if (fix) {
      this.fixNumbers(todoObj);
    }
  }

  fixNumbers(todoRemoved) {
    console.log(this.listOfTodos);
    let todosToFix = [];
    for (let i = 0; i < this.listOfTodos.length; i++) {
      if (this.listOfTodos[i].num > todoRemoved.num) {
        list.removeChild(this.listOfTodos[i].container);
        todosToFix.push(
          new Todo(
            this.listOfTodos[i].id,
            this.listOfTodos[i].num - 1,
            this.listOfTodos[i].text,
            this.listOfTodos[i].checked
          )
        );
      }
    }
    this.listOfTodos = this.listOfTodos.filter(
      (todo) => todo.num < todoRemoved.num
    );
    todosToFix.forEach((x) => {
      this.listOfTodos.push(x);
      list.appendChild(x.container);
    });
  }
}

class Todo {
  constructor(id, num, text, checked) {
    this.checked = checked;
    this.id = id;
    this.num = num;
    this.text = text;
    this.container = this.createTodoObject();
  }

  createTodoObject() {
    const li = document.createElement("li");
    const div = document.createElement("div");
    div.className = classNames.TODO_ITEM;
    div.appendChild(this.getText());
    div.appendChild(this.getCheckbox());
    div.appendChild(this.getDelButton());
    li.appendChild(div);
    return li;
  }

  getCheckbox() {
    let checkbox = document.createElement("input");
    checkbox.setAttribute("type", "checkbox");
    checkbox.className = classNames.TODO_CHECKBOX;
    checkbox.addEventListener("change", () => this.makeChecked());
    checkbox.checked = this.checked;
    return checkbox;
  }

  getText() {
    const text = document.createTextNode(this.num + ". " + this.text);
    text.className = classNames.TODO_TEXT;
    return text;
  }

  getDelButton() {
    const delButton = document.createElement("button");

    delButton.className = classNames.TODO_DELETE;
    delButton.innerHTML = "Delete";
    delButton.addEventListener("click", () => todoList.deleteTodo(this, true));
    return delButton;
  }

  makeChecked() {
    this.checked = true;
    todoList.updateCheckCount();
  }
}

const todoList = new TodoList();

function newTodo() {
  todoList.mkTodo();
  todoList.updateTodoList();
}
