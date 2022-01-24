let startBtn = document.querySelector('#start-button');
let timerEl = document.querySelector('#timer');
let mainEl = document.querySelector('#main');
let homeLi = document.querySelector('#home-link');
let highscoreLi = document.querySelector('#highscore-link')
let timerInterval;
let secondsLeft;
let quizSelection;
let quizQuestions;
let quizAnswers;

const theQuestions = [
    'What does HTML stand for?',
    'Who is making the Web standards?',
    'Choose the correct HTML element for the largest heading',
    'What is the correct HTML element for inserting a line break?',
    'Which property is used to change the background color?',
    'Choose the correct HTML element to define emphasized text',
    'Which HTML attribute is used to define inline styles?',
    'What does CSS stand for?',
    'Where in an HTML document is the correct place to refer to an external style sheet?',
    'Which HTML tag is used to define an internal style sheet?',
];
const theAnswers = [
    [['Hyper Text Markup Language', true], ['Home Tool Markup Language', false], ['Hyperlinks and Text Markup Language', false]],
    [['The World Wide Web Consortium', true], ['Microsoft', false], ['Google', false], ['Mozilla', false]],
    [['h1', true], ['head', false], ['h6', false], ['heading', false]],
    [['br', true], ['lb', false], ['break', false]],
    [['background-color', true], ['bgcolor', false], ['color', false]],
    [['em', true], ['italic', false], ['i', false]],
    [['style', true], ['styles', false], ['font', false], ['class', false]],
    [['Cascading Style Sheets', true], ['Creative Style Sheets', false], ['Computer Style Sheets', false], ['Colorful Style Sheets', false]],
    [['In the head section', true], ['In the body section', false], ['At the end of the document', false]],
    [['style', true], ['css', false], ['script', false]],
];

function init() {
    renderHome();
}

homeLi.addEventListener('click', renderHome);
highscoreLi.addEventListener('click', renderScoreboard);

function initializeTimer() {
    secondsLeft = 99;

    if (!timerInterval) {
        timerInterval = setInterval(function () {
            secondsLeft--;
            timerEl.textContent = secondsLeft;

            if (secondsLeft <= 0) {
                endQuiz();
            }
        }, 1000);
    }
}

function stopTime() {
    clearInterval(timerInterval);
    timerInterval = null;
}

function resetTimer() {
    secondsLeft = 0;
    timerEl.textContent = secondsLeft;
}

function renderHome() {
    resetQuiz();
    if (timerInterval) {
        stopTime();
    }

    mainEl.textContent = '';

    renderTitle('Coding Quiz Challenge');

    let par = document.createElement('p');
    par.textContent = '99 seconds, 10 questions, and you lose 10 seconds for every wrong choice. Can you do it?';

    let startButton = document.createElement('button');
    startButton.textContent = 'Let The Games Begin';
    startButton.setAttribute('id', 'start-button');
    startButton.addEventListener('click', startQuiz);

    mainEl.appendChild(par);
    mainEl.appendChild(startButton);
}

function renderScoreboard() {
    mainEl.textContent = '';
    resetQuiz();

    if (timerInterval) {
        stopTime();
    }

    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));
    
    renderTitle('Leaderboard')

    if (!scoreboard) {
        let par = document.createElement('p');
        par.textContent = 'No highscores to list right now'
        mainEl.appendChild(par);
       
        let button = document.createElement('button');
        button.textContent = 'Back to Home';
        button.addEventListener('click', renderHome);
        mainEl.appendChild(button)

        return
    }


    let playerUl = document.createElement('ul');
    playerUl.classList.add('scoreboard-list');

    for (let i = 0; i < scoreboard.length; i++) {
        let playerLi = document.createElement('li');
        playerLi.classList.add('scoreboard-item');
        playerLi.textContent = `${scoreboard[i].name} -- ${scoreboard[i].score}`;
        playerUl.appendChild(playerLi);
    }


    let homeButton = document.createElement('button');
    homeButton.textContent = 'Back to Home';
    homeButton.addEventListener('click', renderHome);

    let resetButton = document.createElement('button');
    resetButton.textContent = 'Reset Highscores'
    resetButton.addEventListener('click', function() {
        localStorage.clear();
        renderScoreboard();
    });

    mainEl.appendChild(playerUl);
    mainEl.appendChild(homeButton);
    mainEl.appendChild(resetButton);
}

function addHighScore() {
    let scoreboard = JSON.parse(localStorage.getItem('scoreboard'));

    if (scoreboard == null) {
        scoreboard = [];
    }

    let playerName = document.getElementById('initials-input').value.toUpperCase();
    let playerScore = secondsLeft;

    let player = {
        'name': playerName,
        'score': playerScore
    };

    scoreboard.push(player);                      
    scoreboard.sort((a, b) => b.score - a.score); 
    localStorage.setItem('scoreboard', JSON.stringify(scoreboard));
}

function startQuiz() {
    setTheQuiz();
    mainEl.textContent = '';
    initializeTimer(); 
    renderQuestion();
}

function setTheQuiz() {
    quizQuestions = JSON.parse(JSON.stringify(theQuestions));
    quizAnswers = JSON.parse(JSON.stringify(theAnswers));
}

function resetQuiz() {
    quizQuestions = null;
    quizAnswers = null;
    resetTimer();
}

function endQuiz() {
    if (secondsLeft < 0) {
        secondsLeft = 0;
        timerEl.textContent = secondsLeft;
    }
    stopTime();

    let pageTitle = document.createElement('h1');
    pageTitle.textContent = 'Game Over!';

    let quizResults = document.createElement('p');
    quizResults.textContent = `You scored ${secondsLeft} points.`;

    let initialsPrompt = document.createElement('p');
    initialsPrompt.textContent = 'Enter your initials:'
    initialsPrompt.classList.add('enter-initials')

    let initialsInput = document.createElement('input');
    initialsInput.classList.add('initials-input');
    initialsInput.setAttribute('id', 'initials-input');
    initialsInput.maxLength = 3;
    initialsInput.size = 4;

    let highscoreButton = document.createElement('button');
    highscoreButton.textContent = 'Enter Highscore';

    highscoreButton.addEventListener('click', function () {
        if (initialsInput.value) {
            addHighScore();
            resetQuiz();
            renderScoreboard();
        }
    })

    mainEl.textContent = '';

    mainEl.appendChild(pageTitle);
    mainEl.appendChild(quizResults);
    mainEl.appendChild(initialsPrompt);
    mainEl.appendChild(initialsInput);
    mainEl.appendChild(highscoreButton);
};

function renderQuestion() {
    if (quizQuestions.length === 0) {
        return endQuiz();
    }

    mainEl.textContent = '';
    
    let card = document.createElement('div');
    card.classList.add('card');
    
    let icon = document.createElement('i');
    icon.classList.add('fas');
    icon.classList.add('fa-question-circle');
    icon.classList.add('fa-4x');
    card.appendChild(icon);

    randomNum = randomNumber(quizQuestions.length);

    card.appendChild(renderQuestionTitle(quizQuestions[randomNum]));

    let listOptions = document.createElement('ol');

    for (let i = 0; i < quizAnswers[randomNum].length; i++) {
        listOptions.appendChild(createAnswerChoice(randomNum, i));
    }

    card.appendChild(listOptions);

    mainEl.appendChild(card);
}

function createAnswerChoice(randomNum, index) {
    let answer = document.createElement('li');

    answer.classList.add('answer-choice');
    answer.addEventListener('click', checkAnswer);
    answer.textContent = quizAnswers[randomNum][index][0];
    answer.dataset.answer = quizAnswers[randomNum][index][1];

    return answer;
}

function checkAnswer() {
    if (this.dataset.answer === 'true') {
        this.classList.add('correct');

        quizQuestions.splice(randomNum, 1);
        quizAnswers.splice(randomNum, 1);

        setTimeout(renderQuestion, 500);
    } else {
        if (!this.textContent.endsWith('👎')) {
            this.textContent = `${this.textContent} 👎`;
            secondsLeft -= 10;
        }
    }
}

function randomNumber(max) {
    return Math.floor(Math.random() * max);
}

function renderTitle(titleContent) {
    let title = document.createElement('h1');
    title.textContent = titleContent;
    title.classList.add('page-title');

    mainEl.appendChild(title);
}

function renderQuestionTitle(titleContent) {
    let title = document.createElement('h2');
    title.textContent = titleContent;
    title.classList.add('question-title');

    return title;
}

init();