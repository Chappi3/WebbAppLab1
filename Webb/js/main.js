// fields
const api =
  "https://opentdb.com/api.php?amount=10&category=18&difficulty=medium&type=multiple";
const xhr = new XMLHttpRequest();
const startButton = document.getElementById("startButton");
const newButton = document.getElementById("newButton");
const questionBlock = document.querySelector(".question");
const titleBlock = document.querySelector(".content-title");
const progressBlock = document.querySelector(".progress");
const contentBlock = document.getElementById("content");
let questionIndex = 0;
let number = 1;
let correct = 0;
let questions;
let answers;
let results = [];

// Buttons
startButton.addEventListener("click", loadContent); // Start Quiz
newButton.addEventListener("click", reset); // new quiz

// listen for selection
document
  .getElementById("answer1")
  .addEventListener("click", () => answerCheck(0));
document
  .getElementById("answer2")
  .addEventListener("click", () => answerCheck(1));
document
  .getElementById("answer3")
  .addEventListener("click", () => answerCheck(2));
document
  .getElementById("answer4")
  .addEventListener("click", () => answerCheck(3));

// hides progress, titles, new quiz button and question before the quiz starts
progressBlock.style.display = "none";
titleBlock.style.display = "none";
newButton.style.display = "none";
questionBlock.style.display = "none";

contentBlock.innerHTML = 'Welcome to my quiz! Press "Start Quiz" to start!';

// Print question and info
function printQuestion(index) {
  // display progress titles and question block
  progressBlock.style.display = "initial";
  titleBlock.style.display = "initial";
  questionBlock.style.display = "initial";

  // category
  document.getElementById("category").innerHTML = questions[index].category;

  // difficulty
  document.getElementById("difficulty").innerHTML = questions[index].difficulty;

  // question
  document.getElementById("question").innerHTML = questions[index].question;

  // incorrect answers
  answers = questions[index].incorrect_answers;

  // put the correct answer on a random place
  answers.splice(
    Math.floor(Math.random() * 4),
    0,
    questions[index].correct_answer
  );

  // print the answers
  document.getElementById("answer1").innerHTML = answers[0];
  document.getElementById("answer2").innerHTML = answers[1];
  document.getElementById("answer3").innerHTML = answers[2];
  document.getElementById("answer4").innerHTML = answers[3];
}

// check the answer
function answerCheck(nr) {
  // check if answer is correct or not
  if (answers[nr] === questions[questionIndex].correct_answer) {
    // correct answer
    console.log("correct");
    correct++;
  } else {
    // wrong answer
    console.log("wrong");
  }

  // save question, answer and correct answer
  results.push([
    questions[questionIndex].question,
    answers[nr],
    questions[questionIndex].correct_answer
  ]);

  // check if there is any more questions
  checkNextQuestion();
}

// check for next question
function checkNextQuestion() {
  // increment and check if there are more questions
  document.getElementById("progress").value = number++;
  questionIndex++;
  if (questionIndex < questions.length) {
    console.log("next question");
    printQuestion(questionIndex);
  } else {
    console.log("stop quiz");
    stopQuiz();
  }
}

// Stops the quiz
function stopQuiz() {
  // hide titles and question
  titleBlock.style.display = "none";
  questionBlock.style.display = "none";

  // show the content block with results and new quiz button
  contentBlock.style.display = "initial";
  newButton.style.display = "initial";

  // make output for results
  let output = "";
  for (let info in results) {
    output +=
      "<ul>" +
      "<li>Question: " +
      results[info][0] +
      "</li>" +
      "<li>Answer: " +
      results[info][1] +
      "</li>" +
      "<li>Correct answer: " +
      results[info][2] +
      "</li>" +
      "</ul>";
  }

  // show results
  console.log("no more questions. showing results");
  contentBlock.innerHTML =
    "<br>You got " +
    correct +
    " out of 10!<br>" +
    "<h3>Questions and answers:</h3>" +
    output;
  console.log(results);
}

// reset for a new quiz
function reset() {
  questionIndex = 0;
  correct = 0;
  number = 1;
  document.getElementById("progress").value = 0;
  loadContent();
}

// OPEN - type, url/file, async
function loadContent() {
  xhr.open("GET", api, true);

  xhr.onload = function() {
    // Ok status
    if (this.status == 200) {
      // get the questions
      let response = JSON.parse(this.responseText);
      questions = response.results;

      // hide the start quiz button and new quiz button
      startButton.style.display = "none";
      newButton.style.display = "none";

      // hide the content block
      contentBlock.style.display = "none";

      // print the first question
      printQuestion(questionIndex);
    }

    // Forbidden status
    else if (this.status == 403) {
      document.getElementById("content").innerHTML = "Forbidden";
    }

    // Not Found status
    else if (this.status == 404) {
      document.getElementById("content").innerHTML = "Not Found";
    }
  };

  // on error
  xhr.onError = function() {
    console.log("Request error...");
  };

  // Send request
  xhr.send();
}
