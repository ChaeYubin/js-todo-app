const dateEl = document.querySelector(".date");
const quoteEl = document.querySelector(".quote");

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
