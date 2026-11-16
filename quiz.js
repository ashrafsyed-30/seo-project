
/* SEO Quiz JavaScript */

// Get the HTML elements
const quizForm = document.getElementById("seoQuiz");
const timer = document.getElementById("timer");
const results = document.getElementById("results");
const resetBtn = document.getElementById("resetBtn");

// Timer starts with 10 minutes
let timeLeft = 600;
let timerInterval;
let quizSubmitted = false;

// Correct answers
const correctAnswers = {
    q1: "search engine optimization",
    q2: "organic traffic",
    q3: "a",
    q4: "b",
    q5: "c",
    q6: ["a", "b", "c"],
    q7: "false",
    q8: "true",
    q9: "b",
    q10: "c"
};

// Answers displayed in the results
const answerText = {
    q1: "Search Engine Optimization",
    q2: "Organic Traffic",
    q3: "Increase website visibility",
    q4: "Improving page titles",
    q5: "Helping search engines discover pages",
    q6: "Useful content, Mobile-friendly design, Clear headings",
    q7: "False",
    q8: "True",
    q9: "A word or phrase people search for",
    q10: "Reach nearby customers"
};

// Display remaining time
function showTime() {
    let minutes = Math.floor(timeLeft / 60);
    let seconds = timeLeft % 60;

    timer.textContent = "Time Left: " +
        minutes + ":" + String(seconds).padStart(2, "0");
}

// Start countdown
function startTimer() {
    showTime();

    timerInterval = setInterval(function() {
        if (quizSubmitted) return;

        timeLeft--;
        showTime();

        if (timeLeft <= 0) {
            submitQuiz();
        }
    }, 1000);
}

// Get answer for a question
function getAnswer(number) {
    let question = "q" + number;

    // Text questions
    if (number === 1 || number === 2) {
        return document.getElementById(question)
            .value.trim().toLowerCase().replace(/\s+/g, " ");
    }

    // Checkbox question
    if (number === 6) {
        let selected = document.querySelectorAll(
            'input[name="q6"]:checked'
        );

        return Array.from(selected)
            .map(item => item.value)
            .sort();
    }

    // Radio questions
    let selected = document.querySelector(
        'input[name="' + question + '"]:checked'
    );

    return selected ? selected.value : "";
}

// Check answers and calculate score
function submitQuiz() {
    if (quizSubmitted) return;

    quizSubmitted = true;
    clearInterval(timerInterval);

    let score = 0;
    let feedback = "";

    for (let i = 1; i <= 10; i++) {
        let question = "q" + i;
        let userAnswer = getAnswer(i);
        let correctAnswer = correctAnswers[question];

        let isCorrect = false;

        if (Array.isArray(correctAnswer)) {
            isCorrect = JSON.stringify(userAnswer) ===
                JSON.stringify(correctAnswer);
        } else {
            isCorrect = userAnswer === correctAnswer;
        }

        if (isCorrect) {
            score++;
        }

        let resultClass = isCorrect ? "correct" : "incorrect";
        let resultText = isCorrect ? "Correct" : "Incorrect";

        feedback +=
            '<div class="feedback ' + resultClass + '">' +
            '<strong>Question ' + i + ': ' + resultText + '</strong>' +
            '<p>Score: ' + (isCorrect ? 1 : 0) + '/1</p>' +
            '<p>Correct answer: ' + answerText[question] + '</p>' +
            '</div>';
    }

    // Calculate time spent
    let timeSpent = 600 - timeLeft;
    let minutes = Math.floor(timeSpent / 60);
    let seconds = timeSpent % 60;

    // Pass if score is 7 or higher
    let passed = score >= 7;

    results.innerHTML =
        '<h2>Quiz Results</h2>' +
        '<h3 class="' + (passed ? "correct" : "incorrect") + '">' +
        (passed ? "PASS" : "FAIL") + '</h3>' +
        '<p>Total Score: ' + score + '/10</p>' +
        '<p>Time Spent: ' + minutes + ' minutes ' +
        seconds + ' seconds</p>' +
        feedback;

    // Lock answers after submission
    quizForm.querySelectorAll("input").forEach(function(input) {
        input.disabled = true;
    });

    quizForm.querySelector('button[type="submit"]').disabled = true;

    results.scrollIntoView({ behavior: "smooth" });
}

// Submit button
quizForm.addEventListener("submit", function(event) {
    event.preventDefault();
    submitQuiz();
});

// Retake button
resetBtn.addEventListener("click", function() {
    clearInterval(timerInterval);

    quizForm.reset();
    results.innerHTML = "";

    quizForm.querySelectorAll("input").forEach(function(input) {
        input.disabled = false;
    });

    quizForm.querySelector('button[type="submit"]').disabled = false;

    timeLeft = 600;
    quizSubmitted = false;

    startTimer();

    window.scrollTo({ top: 0, behavior: "smooth" });
});

// Start timer when page loads
startTimer();
