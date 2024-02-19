const dateEl = document.querySelector(".date");
const quoteEl = document.querySelector(".quote");
const addGoalBtnEl = document.querySelector(".add-goal-btn");
const goalListEl = document.querySelector(".goal-list");
const todoListEl = document.querySelector(".todo-list");
const addTodoBtnEl = document.querySelector(".add-todo-btn");

// 목표 및 투두 데이터를 담을 배열
let goals = [];

loadFromLocalStorage();

// 현재 선택된 목표 아이디를 저장할 변수
let selectedGoalId = goals.length == 0 ? null : goals[0].id;

// 목표가 선택되어있지 않다면 투두 추가 버튼을 비활성화한다.
if (selectedGoalId == null || goals.length == 0) {
  addTodoBtnEl.setAttribute("disabled", "");
}

if (selectedGoalId !== null) {
  displayGoalList();
  displayTodoList();
}

// 현재 날짜 표시
displayDate();
// 랜덤 명언 표시
displayRandomQuote();

// 목표를 선택하면 하위 투두리스트가 오른쪽에 보인다.
goalListEl.addEventListener("click", (e) => {
  selectedGoalId = e.target.id;

  // 선택되지 않은 목표들은 선택 효과(css)가 적용되지 않는다.
  const nonSelectedGoal = goals.filter((goal) => goal.id != selectedGoalId);
  nonSelectedGoal.forEach((goal) =>
    document.getElementById(goal.id).classList.remove("selected-goal")
  );

  if (e.target.classList[0] == "goal") {
    e.target.classList.add("selected-goal");

    // 투두 추가 버튼 활성화
    addTodoBtnEl.removeAttribute("disabled");

    // 화면에 띄워진 투두리스트 목록을 지운다.
    todoListEl.innerHTML = "";

    displayTodoList();
  }
});

function displayGoalList() {
  goals.forEach((goal) => {
    // 화면에 보일 요소 생성
    const { itemEl, inputEl, editBtnEl, deleteBtnEl } = createGoalEl(goal);
    inputEl.setAttribute("disabled", "");

    // 리스트 요소 안에 방금 생성한 아이템 요소 추가
    goalListEl.append(itemEl);
  });
}

// 선택한 목표의 하위 투두리스트만 화면에 그려주는 함수
function displayTodoList() {
  const todoList = goals.filter((goal) => goal.id == selectedGoalId)[0].todo;

  if (todoList.length > 0) {
    todoList.forEach((todo) => {
      // 화면에 보일 요소 생성
      const { itemEl, inputEl, editBtnEl, deleteBtnEl } = createTodoEl(todo);
      inputEl.setAttribute("disabled", "");

      // 리스트 요소 안에 방금 생성한 아이템 요소 추가
      todoListEl.append(itemEl);
    });
  }
}

function displayDate() {
  const now = new Date();

  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const date = now.getDate();
  dateEl.innerHTML = `${year}년 ${month}월 ${date}일`;
}

async function displayRandomQuote() {
  const response = await fetch("https://api.adviceslip.com/advice");
  const quote = await response.json();
  quoteEl.innerHTML = quote.slip.advice;
}

addGoalBtnEl.addEventListener("click", createNewGoal);
addTodoBtnEl.addEventListener("click", createNewTodo);

// 새로운 목표 아이템 객체 생성
function createNewGoal() {
  const item = {
    id: new Date().getTime(),
    text: "",
    achieveRate: 0,
    complete: false,
    todo: [],
  };
  goals.unshift(item);
  saveToLocalStorage();

  // 화면에 보일 요소 생성
  const { itemEl, inputEl, editBtnEl, deleteBtnEl } = createGoalEl(item);

  // 리스트 요소 안에 방금 생성한 아이템 요소 추가
  goalListEl.prepend(itemEl);
  inputEl.focus();
}

// 새로운 목표 아이템 요소 생성
function createGoalEl(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("goal");
  itemEl.id = item.id;

  const achieveRateEl = document.createElement("div");
  achieveRateEl.classList.add("achieve-rate");

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.classList.add("goal-text");

  if (itemEl.id == selectedGoalId) {
    itemEl.classList.add("selected-goal");
  }

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("edit-btn");

  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.classList.add("delete-btn");

  // blur: 요소가 포커스를 잃을 때 발생하는 이벤트
  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
  });

  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      inputEl.setAttribute("disabled", "");
    }
  });

  inputEl.addEventListener("focus", () => {
    inputEl.removeAttribute("disabled");
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
    saveToLocalStorage();
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  deleteBtnEl.addEventListener("click", () => {
    goals = goals.filter((el) => el.id !== item.id);
    saveToLocalStorage();

    if (goals.length == 0) {
      addTodoBtnEl.setAttribute("disabled", "");
    }

    itemEl.remove();
  });

  actionsEl.appendChild(editBtnEl);
  actionsEl.appendChild(deleteBtnEl);

  itemEl.append(achieveRateEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);
  inputEl.focus();

  return { itemEl, inputEl, editBtnEl, deleteBtnEl };
}

// 새로운 투두 아이템 객체 생성
function createNewTodo() {
  const item = {
    id: new Date().getTime(),
    text: "",
    complete: false,
  };

  goals = goals.map((goal) => {
    if (goal.id == selectedGoalId) {
      return { ...goal, todo: [item, ...goal.todo] };
    }
    return goal;
  });
  saveToLocalStorage();

  // 화면에 보일 요소 생성
  const { itemEl, inputEl, editBtnEl, deleteBtnEl } = createTodoEl(item);

  // 리스트 요소 안에 방금 생성한 아이템 요소 추가
  todoListEl.prepend(itemEl);
  inputEl.focus();
}

// 새로운 투두 아이템 요소 생성
function createTodoEl(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("todo");
  itemEl.id = item.id;

  const checkboxEl = document.createElement("input");
  checkboxEl.type = "checkbox";
  checkboxEl.checked = item.complete;

  if (item.complete) {
    itemEl.classList.add("complete");
  }

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.classList.add("todo-text");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("edit-btn");

  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.classList.add("delete-btn");

  checkboxEl.addEventListener("change", () => {
    item.complete = checkboxEl.checked;

    if (item.complete) {
      itemEl.classList.add("complete");
    } else {
      itemEl.classList.remove("complete");
    }
    saveToLocalStorage();
  });

  inputEl.addEventListener("blur", () => {
    inputEl.setAttribute("disabled", "");
  });

  inputEl.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      inputEl.setAttribute("disabled", "");
    }
  });

  inputEl.addEventListener("focus", () => {
    inputEl.removeAttribute("disabled");
  });

  inputEl.addEventListener("input", () => {
    item.text = inputEl.value;
    saveToLocalStorage();
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  deleteBtnEl.addEventListener("click", () => {
    goals = goals.map((goal) => {
      if (goal.id != selectedGoalId) {
        return { ...goal };
      } else {
        return { ...goal, todo: goal.todo.filter((el) => el.id !== item.id) };
      }
    });
    saveToLocalStorage();
    itemEl.remove();
  });

  actionsEl.appendChild(editBtnEl);
  actionsEl.appendChild(deleteBtnEl);

  itemEl.append(checkboxEl);
  itemEl.append(inputEl);
  itemEl.append(actionsEl);
  inputEl.focus();

  return { itemEl, inputEl, editBtnEl, deleteBtnEl };
}

// 로컬 스토리지에 goals 배열 저장
function saveToLocalStorage() {
  const data = JSON.stringify(goals);
  localStorage.setItem("goals", data);
}

// 로컬 스토리지에서 goals 배열 가져오기
function loadFromLocalStorage() {
  const data = localStorage.getItem("goals");

  if (data) {
    goals = JSON.parse(data);
  }
}
