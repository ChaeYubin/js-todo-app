const dateEl = document.querySelector(".date");
const quoteEl = document.querySelector(".quote");
const addGoalBtnEl = document.querySelector(".add-goal-btn");
const goalListEl = document.querySelector(".goal-list");
const addTodoBtnEl = document.querySelector(".add-todo-btn");

// 목표 및 투두 데이터를 담을 배열
goals = [];

// 화면이 로드되면
window.onload = function () {
  // 현재 날짜 표시
  showDate();
  // 랜덤 명언 표시
  showRandomQuote();
};

showDate = function () {
  const now = new Date();

  const month = now.getMonth() + 1;
  const date = now.getDate();
  dateEl.innerHTML = `${month}월 ${date}일`;
};

showRandomQuote = async function () {
  const response = await fetch("https://api.adviceslip.com/advice");
  const quote = await response.json();
  quoteEl.innerHTML = quote.slip.advice;
};

addGoalBtnEl.addEventListener("click", createNewGoal);

function createNewGoal() {
  // 새로운 목표 아이템 객체 생성
  const item = {
    id: new Date().getTime(),
    text: "",
    achieveRate: 0,
    complete: false,
  };
  goals.unshift(item);

  // 화면에 보일 요소 생성
  const { itemEl, inputEl, editBtnEl, deleteBtnEl } = createGoalEl(item);

  // 리스트 요소 안에 방금 생성한 아이템 요소 추가
  goalListEl.prepend(itemEl);
  inputEl.focus();
}

function createGoalEl(item) {
  const itemEl = document.createElement("div");
  itemEl.classList.add("goal");

  const achieveRateEl = document.createElement("div");
  achieveRateEl.classList.add("achieve-rate");

  const inputEl = document.createElement("input");
  inputEl.type = "text";
  inputEl.value = item.text;
  inputEl.classList.add("goal-text");

  const actionsEl = document.createElement("div");
  actionsEl.classList.add("actions");

  const editBtnEl = document.createElement("button");
  editBtnEl.classList.add("edit-btn");

  const deleteBtnEl = document.createElement("button");
  deleteBtnEl.classList.add("delete-btn");

  // blur가: 요소가 포커스를 잃을 때 발생하는 이벤트
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
  });

  editBtnEl.addEventListener("click", () => {
    inputEl.removeAttribute("disabled");
    inputEl.focus();
  });

  deleteBtnEl.addEventListener("click", () => {
    goals = goals.filter((el) => el.id !== item.id);
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
