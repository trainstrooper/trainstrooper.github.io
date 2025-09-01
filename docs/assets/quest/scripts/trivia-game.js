document.addEventListener('DOMContentLoaded', function () {
    // Add a class to the body when the page loads to trigger the fade-in effect
    document.body.classList.add('page-loaded');

    // Get the mobile menu button and the mobile menu
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    // Toggle the mobile menu on button click
    mobileMenuButton.addEventListener('click', function() {
        mobileMenu.classList.toggle('hidden');
    });

    // --- Game Logic ---

    // Global state variables
    let selectedQuestions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // DOM elements
    const startScreen = document.getElementById('start-screen');
    const quizScreen = document.getElementById('quiz-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startButton = document.getElementById('start-button');
    const playAgainButton = document.getElementById('play-again-button');
    const questionText = document.getElementById('question-text');
    const answerButtonsContainer = document.getElementById('answer-buttons');
    const questionCountSpan = document.getElementById('question-count');
    const scoreSpan = document.getElementById('score');
    const finalScoreText = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');

    // Event Listeners for game control
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);

    /**
     * Starts a new game session.
     * Resets score, shuffles questions, and displays the first question.
     */
    function startGame() {
        // Reset game state
        currentQuestionIndex = 0;
        score = 0;
        scoreSpan.textContent = `Score: ${score}`;

        // Randomly select 10 questions from the allQuestions array
        selectedQuestions = allQuestions.sort(() => 0.5 - Math.random()).slice(0, 10);

        // Hide start/results screens and show the quiz screen
        startScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        showQuestion();
    }

    /**
     * Displays the current question and its answers.
     */
    function showQuestion() {
        if (currentQuestionIndex < selectedQuestions.length) {
            const currentQuestion = selectedQuestions[currentQuestionIndex];
            questionText.textContent = currentQuestion.question;
            questionCountSpan.textContent = `Question ${currentQuestionIndex + 1} of 10`;

            // Clear previous answers and create new buttons for the current question
            answerButtonsContainer.innerHTML = '';
            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('button', 'answer-button', 'bg-gray-700', 'text-gray-200', 'py-4', 'px-6', 'rounded-lg', 'font-medium', 'text-left', 'transform', 'hover:bg-gray-600', 'transition', 'duration-200');
                button.dataset.index = index;
                button.addEventListener('click', handleAnswerClick);
                answerButtonsContainer.appendChild(button);
            });
        } else {
            // End of the game, show results
            showResults();
        }
    }

    /**
     * Handles the user's answer click.
     * @param {Event} event The click event object.
     */
    function handleAnswerClick(event) {
        const selectedButton = event.target;
        const selectedAnswerIndex = parseInt(selectedButton.dataset.index);
        const currentQuestion = selectedQuestions[currentQuestionIndex];

        // Disable all buttons to prevent multiple clicks
        Array.from(answerButtonsContainer.children).forEach(button => {
            button.removeEventListener('click', handleAnswerClick);
            button.disabled = true;
        });

        // Check if the selected answer is correct and update the score
        if (selectedAnswerIndex === currentQuestion.correctAnswer) {
            score++;
            scoreSpan.textContent = `Score: ${score}`;
            selectedButton.classList.add('correct-answer');
        } else {
            selectedButton.classList.add('wrong-answer');
            // Highlight the correct answer for the user
            // const correctButton = answerButtonsContainer.querySelector(`[data-index="${currentQuestion.correctAnswer}"]`);
            // if (correctButton) {
            //     correctButton.classList.add('correct-answer');
            // }
        }

        // Move to the next question after a short delay
        setTimeout(() => {
            currentQuestionIndex++;
            showQuestion();
        }, 1000);
    }

    /**
     * Displays the final results screen at the end of the game.
     */
    function showResults() {
        quizScreen.classList.add('hidden');
        resultsScreen.classList.remove('hidden');

        finalScoreText.textContent = `You scored ${score} out of 10!`;
        if (score === 10) {
            resultMessage.textContent = "You're a true train expert!";
            resultMessage.classList.add('text-green-400');
        } else if (score >= 7) {
            resultMessage.textContent = "Great job! You know a lot about freight trains.";
            resultMessage.classList.add('text-green-400');
        } else {
            resultMessage.textContent = "Looks like you could use a few more trips on the rails. Try again!";
            resultMessage.classList.add('text-yellow-400');
        }
    }
});
