const queAnsPairs = [
  {
    question: "Which class in Java is used to read data from a file?",
    options: ["FileReader", "BufferedWriter", "FileWriter", "Scanner"],
    answer: "FileReader",
  },
  {
    question: "Hashset is a implementation class of ?",
    options: ["Set", "Map", "List", "Queue"],
    answer: "Set",
  },
  {
    question: "number of primitive datatypes in Java ?",
    options: ["8", "6", "10", "7"],
    answer: "8",
  },
  {
    question: "Can an interface in Java have a method with a body?",
    options: ["Yes", "No", "Only in abstract class", "Only in enums"],
    answer: "Yes",
  },
  {
    question: "What is the difference between == and equals() in Java?",
    options: [
      "== compares references, equals() compares values",
      "== compares values, equals() compares references",
      "== compares data types, equals() compares sizes",
      "== compares strings, equals() compares objects",
    ],
    answer: "== compares references, equals() compares values",
  },
  {
    question: "Runtime exception is Checked or Unchecked exception ?",
    options: ["Unchecked", "Checked", "Both", "Compile-time"],
    answer: "Unchecked",
  },
  {
    question: "The underlying structure of LinkedList is ?",
    options: [
      "Doubly Linked List",
      "Array",
      "Single Linked List",
      "Hash Table",
    ],
    answer: "Doubly Linked List",
  },
  {
    question: "What is the default size of an ArrayList in Java?",
    options: ["10", "0", "16", "5"],
    answer: "10",
  },
  {
    question: "String are _____ in nature",
    options: ["immutable", "mutable", "constant", "variable"],
    answer: "immutable",
  },
  {
    question: "What is the purpose of the final keyword in Java?",
    options: [
      "To restrict modification or inheritance",
      "To allow method overriding",
      "To enable runtime polymorphism",
      "To define abstract methods",
    ],
    answer: "To restrict modification or inheritance",
  },
];

let n = 5;
let currentQuestionIndex = 0;
let score = 0;
const randomQuestions = getRandomQuestions(queAnsPairs, n);

function loadQuestions() {
  if (currentQuestionIndex >= randomQuestions.length) {
    displayResult();
    return;
  }
  const item = randomQuestions[currentQuestionIndex];

  const quizForm = document.getElementById("quizForm");

  const questionDiv = document.createElement("div");
  const btnDiv = document.createElement("div");
  questionDiv.classList.add("question");

  const questionHTML = `<p>${currentQuestionIndex + 1}. ${item.question}</p>`;
  questionDiv.innerHTML = questionHTML;

  item.options.forEach((option) => {
    questionDiv.innerHTML += `
        <div class="options">
          <label>
            <input type="radio" name="q${currentQuestionIndex}" value="${option}">
            ${option}
          </label>
        </div>
        `;
  });
  if (currentQuestionIndex === 0) {
    btnDiv.innerHTML += `<button id="nxt-btn">Next</button>`;
  } else if (
    currentQuestionIndex > 0 &&
    currentQuestionIndex < randomQuestions.length - 1
  ) {
    btnDiv.innerHTML += `<button id="prev-btn">Prev</button>`;
    btnDiv.innerHTML += `<button id="nxt-btn">Next</button>`;
  } else if (currentQuestionIndex === randomQuestions.length - 1) {
    btnDiv.innerHTML += `<button id="prev-btn">Prev</button>`;
    btnDiv.innerHTML += `<button id="nxt-btn">Submit</button>`;
  }
  quizForm.innerHTML = "";
  quizForm.appendChild(questionDiv);
  quizForm.appendChild(btnDiv);

  document.querySelector("#nxt-btn").addEventListener("click", (event) => {
    event.preventDefault();
    const selectedOption = document.querySelector(
      `input[name="q${currentQuestionIndex}"]:checked`
    );

    if (selectedOption) {
      if (selectedOption.value === item.answer) {
        score++;
      }
      currentQuestionIndex++;

      if (currentQuestionIndex < randomQuestions.length) {
        loadQuestions();
      } else {
        displayResult(score);
      }
    } else {
      alert("Please select an option");
    }
  });

  document.querySelector("#prev-btn").addEventListener("click", (event) => {
    event.preventDefault();
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      loadQuestions();
    }
  });
}

function displayResult(score) {
  document.querySelector(".container").innerHTML =
    '<div id="result-msg"></div>';
  console.log(score);
  console.log(randomQuestions.length);

  const scorePercent = (score / randomQuestions.length) * 100;
  if (scorePercent >= 60) {
    document.getElementById(
      "result-msg"
    ).innerText = `You succesfully passed the test with ${scorePercent}%`;
  } else {
    document.getElementById(
      "result-msg"
    ).innerText = `You failed the test. Your score ${scorePercent}`;
  }
}

function getRandomQuestions(queAnsPairs, n) {
  const usedIndexes = new Set();
  const result = [];
  while (result.length < n) {
    const randomIndex = Math.floor(Math.random() * queAnsPairs.length);

    if (!usedIndexes.has(randomIndex)) {
      usedIndexes.add(randomIndex);

      result.push({
        question: queAnsPairs[randomIndex].question,
        options: queAnsPairs[randomIndex].options,
        answer: queAnsPairs[randomIndex].answer,
      });
    }
  }

  return result;
}

loadQuestions();
