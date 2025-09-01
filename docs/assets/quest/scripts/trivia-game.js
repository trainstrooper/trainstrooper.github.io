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
    const questionDisplay = document.getElementById('question-display');
    const answerButtonsContainer = document.getElementById('answer-buttons');
    const questionCountSpan = document.getElementById('question-count');
    const scoreSpan = document.getElementById('score');
    const finalScoreText = document.getElementById('final-score');
    const resultMessage = document.getElementById('result-message');

    // Event Listeners for game control
    startButton.addEventListener('click', startGame);
    playAgainButton.addEventListener('click', startGame);

    /**
     * Starts or restarts the game.
     */
    function startGame() {
        // Shuffle and select a subset of questions
        const shuffledQuestions = [...allQuestions].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffledQuestions.slice(0, 10);
        
        // Reset game state
        currentQuestionIndex = 0;
        score = 0;
        scoreSpan.textContent = `Score: ${score}`;

        // Show the quiz screen
        startScreen.classList.add('hidden');
        resultsScreen.classList.add('hidden');
        quizScreen.classList.remove('hidden');

        // Display the first question
        showQuestion();
    }

    /**
     * Displays the current question and its answer choices.
     */
    function showQuestion() {
        // Clear previous content
        answerButtonsContainer.innerHTML = '';
        questionDisplay.innerHTML = '';
        
        // Check if there are more questions
        if (currentQuestionIndex < selectedQuestions.length) {
            // Get the current question
            const currentQuestion = selectedQuestions[currentQuestionIndex];
            
            // Check if the question has an image
            if (currentQuestion.image) {
                const questionImage = document.createElement('img');
                questionImage.src = currentQuestion.image;
                questionImage.alt = currentQuestion.answers[currentQuestion.correctAnswer]; // Use the correct answer as alt text for accessibility
                questionImage.classList.add('w-full', 'max-h-60', 'object-contain', 'rounded-lg', 'mb-4', 'shadow-md');
                questionDisplay.appendChild(questionImage);
            } else {
                const questionText = document.createElement('h2');
                questionText.textContent = currentQuestion.question;
                questionText.classList.add('text-xl', 'md:text-2xl', 'font-bold', 'mb-6', 'text-center');
                questionDisplay.appendChild(questionText);
            }

            // Update the question count
            questionCountSpan.textContent = `Question ${currentQuestionIndex + 1} of 10`;
            
            // Create buttons for each answer choice
            currentQuestion.answers.forEach((answer, index) => {
                const button = document.createElement('button');
                button.textContent = answer;
                button.classList.add('answer-button', 'w-full', 'py-3', 'px-6', 'rounded-lg', 'font-semibold', 'text-white', 'bg-blue-600', 'hover:bg-blue-700', 'transition', 'duration-300', 'transform', 'hover:scale-105', 'shadow-md', 'mb-4');
                button.setAttribute('data-index', index);
                button.addEventListener('click', () => handleAnswerClick(button, index));
                answerButtonsContainer.appendChild(button);
            });
        } else {
            // End of the game
            showResults();
        }
    }

    /**
     * Handles a user's answer click.
     * @param {HTMLElement} selectedButton - The button element that was clicked.
     * @param {number} selectedAnswerIndex - The index of the selected answer.
     */
    function handleAnswerClick(selectedButton, selectedAnswerIndex) {
        // Disable all buttons to prevent multiple clicks
        Array.from(answerButtonsContainer.children).forEach(button => {
            button.disabled = true;
        });

        const currentQuestion = selectedQuestions[currentQuestionIndex];

        if (selectedAnswerIndex === currentQuestion.correctAnswer) {
            score++;
            scoreSpan.textContent = `Score: ${score}`;
            selectedButton.classList.add('correct-answer');
        } else {
            selectedButton.classList.add('wrong-answer');
            // Highlight the correct answer for the user
            // const correctButton = answerButtonsContainer.querySelector(`[data-index=\"${currentQuestion.correctAnswer}\"]`);
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
