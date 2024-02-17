const list = document.getElementById("list");
const createBtn = document.getElementById("create-btn");

let todos = [];

createBtn.addEventListener("click", createNewTodo);

function createNewTodo() {
  // 새로운 아이템 객체 생성
  const item = { id: new Date().getTime(), text: "", complete: false };
  todos.unshift(item);

  // 화면에 보일 요소 생성
  const { itemElement, inputElement, editBtnElement, removeBtnElement } =
    createTodoElement(item);

  // 리스트 요소 안에 방금 생성한 아이템 요소 추가
  list.prepend(itemElement);
  inputElement.removeAttribute("disabled");
  inputElement.focus();
}

function createTodoElement(item) {
  const itemElement = document.createElement("div");
  itemElement.classList.add("item");

  const checkboxElement = document.createElement("input");
  checkboxElement.type = "checkbox";

  if (item.complete) {
    checkboxElement.classList.add("complete");
  }

  const inputElement = document.createElement("input");
  inputElement.type = "text";
  inputElement.value = item.text;
  inputElement.setAttribute("disabled", "");

  const actionsElement = document.createElement("div");
  actionsElement.classList.add("actions");

  const editBtnElement = document.createElement("button");
  editBtnElement.classList.add("material-icons");
  editBtnElement.innerText = "edit";

  const removeBtnElement = document.createElement("button");
  removeBtnElement.classList.add("material-icons", "remove-btn");
  removeBtnElement.innerText = "remove_circles";

  actionsElement.append(editBtnElement);
  actionsElement.append(removeBtnElement);

  itemElement.append(checkboxElement);
  itemElement.append(inputElement);
  itemElement.append(actionsElement);

  return { itemElement, inputElement, editBtnElement, removeBtnElement };
}
