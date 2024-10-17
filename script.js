let n = 5;
let currentQuestionIndex = 0;
let score = 0;
let randomQuestions = [];
const selectedAns = [];
const isCorrect = [];
const quizForm = document.getElementById("quizForm");

async function loadData() {
  try {
    const response = await fetch("quesAnsPairs.json");
    if (!response.ok) {
      throw new Error("Error while fetching data", response.status);
    }
    const queAnsPairs = await response.json();
    randomQuestions = getRandomQuestions(queAnsPairs, n);
    loadQuestions();
  } catch (error) {
    console.error("Error fetching questions:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadData();
});

async function loadQuestions() {
  if (currentQuestionIndex >= randomQuestions.length) {
    displayResult();
    return;
  }

  const item = randomQuestions[currentQuestionIndex];
  if (!item) {
    console.error("Question not found for index", currentQuestionIndex);
  }
  displayNumList();

  const questionDiv = document.createElement("div");
  const questionHTML = `<p>${currentQuestionIndex + 1}. ${item.question}</p>`;
  questionDiv.innerHTML = questionHTML;

  item.options.forEach((option) => {
    const isChecked =
      selectedAns[currentQuestionIndex] === option ? "checked" : "";
    questionDiv.innerHTML += `
    <div class="options">
    <label>
    <input type="radio" name="q${currentQuestionIndex}" value="${option}"${isChecked}>
    ${option}
    </label>
    </div>
    `;
  });

  quizForm.appendChild(questionDiv);

  buttonVisibility();

  document.querySelector("#nxt-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const selectedOption = document.querySelector(
      `input[name="q${currentQuestionIndex}"]:checked`
    );

    if (selectedOption) {
      selectedAns[currentQuestionIndex] = selectedOption.value;
      isCorrect[currentQuestionIndex] = selectedOption.value === item.answer;
      while (currentQuestionIndex < isCorrect.length) {
        if (isCorrect[currentQuestionIndex] == true) {
          score++;
        }
        currentQuestionIndex++;
      }
      console.log(isCorrect, score);
      // currentQuestionIndex++;
      quizForm.innerHTML = "";
      if (currentQuestionIndex < randomQuestions.length) {
        loadQuestions();
      } else {
        displayResult(score);
      }
    } else {
      alert("Please select an option");
    }
  });

  if (currentQuestionIndex !== 0) {
    document.querySelector("#prev-btn").addEventListener("click", (event) => {
      event.preventDefault();
      const selectedOption = document.querySelector(
        `input[name="q${currentQuestionIndex}"]`
      );
      quizForm.innerHTML = "";
      if (currentQuestionIndex > 0) {
        selectedOption.value = selectedAns[currentQuestionIndex];
        currentQuestionIndex--;
        isCorrect[currentQuestionIndex] = 0;
        loadQuestions();
      }
    });
  }
}

function buttonVisibility() {
  const prevBtn = document.getElementById("prev-btn");
  const nxtBtn = document.getElementById("nxt-btn");

  if (currentQuestionIndex === 0) {
    prevBtn.style.display = "none";
  } else {
    prevBtn.style.display = "flex";
  }

  if (currentQuestionIndex === randomQuestions.length) {
    nxtBtn.innerText = "✓";
    nxtBtn.onclick = (event) => {
      event.preventDefault();
      displayResult(score);
    };
  }
}

function displayResult(score) {
  document.querySelector(".container").innerHTML =
    '<div id="result-msg"></div>';
  const scorePercent = (score / randomQuestions.length) * 100;

  if (scorePercent >= 60) {
    document.getElementById(
      "result-msg"
    ).innerText = `You successfully passed the test with ${scorePercent}%`;
  } else {
    document.getElementById(
      "result-msg"
    ).innerText = `You failed the test. Your score is ${scorePercent}%`;
  }
}

function getRandomQuestions(queAnsPairs, n) {
  const usedIndexes = new Set();
  const result = [];

  while (result.length < n) {
    const randomIndex = Math.floor(
      Math.random() * queAnsPairs.queAnsPairs.length
    );
    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);
      result.push(queAnsPairs.queAnsPairs[randomIndex]);
    }
  }
  return result;
}

function displayNumList() {
  const listContainer =
    document.querySelector(".arrowContainer") || document.createElement("div");
  listContainer.classList.add("arrowContainer");

  if (!listContainer.parentElement) {
    listContainer.innerHTML = `<div id="prev-btn">←</div>
      <ul class="NumberList"></ul>
      <div id="nxt-btn">→</div>`;
  }

  if (quizForm) {
    quizForm.appendChild(listContainer);
  } else {
    console.error("QuizForm is not created");
  }

  const numList = listContainer.querySelector(".NumberList");
  numList.innerHTML = "";

  randomQuestions.forEach((_, index) => {
    const listItem = document.createElement("li");
    listItem.innerText = index + 1;
    listItem.className = index === currentQuestionIndex ? "active" : "";

    listItem.addEventListener("click", () => {
      currentQuestionIndex = index;
      quizForm.innerHTML = "";
      loadQuestions();
    });

    numList.appendChild(listItem);
  });
}

// loadQuestions();
