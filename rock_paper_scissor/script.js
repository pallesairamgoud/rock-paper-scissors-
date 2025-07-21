// Game state
let gameState = {
    playerName: '',
    computerName: '',
    totalRounds: 5,
    currentRound: 1,
    playerScore: 0,
    computerScore: 0,
    gameInProgress: false
};

// Computer names for random generation
const computerNames = [
    'Alpha', 'Beta', 'Cipher', 'Delta', 'Echo', 'Falcon', 'Ghost', 'Hunter',
    'Iron', 'Jade', 'Knight', 'Lightning', 'Matrix', 'Nova', 'Omega', 'Phoenix',
    'Quantum', 'Raven', 'Storm', 'Titan', 'Ultra', 'Viper', 'Wolf', 'Xerus',
    'Yeti', 'Zephyr', 'Blaze', 'Cosmos', 'Dynamo', 'Fury'
];

// Motivational messages
const winMessages = [
    "Victory belongs to those who believe in the beauty of their dreams. You've proven your strategic prowess!",
    "Like a chess grandmaster, you've outmaneuvered your opponent with skill and wisdom!",
    "Success is not final, but this victory shows your determination and smart thinking!",
    "Champions aren't made in the comfort zones. You've risen to the challenge magnificently!",
    "Your strategic mind has triumphed! This victory is a testament to your gaming skills!"
];

const loseMessages = [
    "Every champion was once a contender who refused to give up. This is just the beginning of your journey to mastery!",
    "Failure is simply the opportunity to begin again, this time more intelligently. You've got this!",
    "The greatest glory is not in never falling, but in rising every time we fall. Come back stronger!",
    "Success is stumbling from failure to failure with no loss of enthusiasm. Your comeback starts now!",
    "Even the mightiest oak was once an acorn. Every defeat teaches us something valuable!"
];

// Page management
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// Initialize the game
document.addEventListener('DOMContentLoaded', function() {
    // Start button event
    document.getElementById('start-btn').addEventListener('click', function() {
        this.style.transform = 'translateY(-1px)';
        setTimeout(() => {
            showPage('setup-page');
        }, 150);
    });

    // Random name generator
    document.getElementById('random-name-btn').addEventListener('click', function() {
        const randomName = computerNames[Math.floor(Math.random() * computerNames.length)];
        document.getElementById('computer-name').value = randomName;
        
        // Add a little animation to the button
        this.style.transform = 'rotate(360deg)';
        setTimeout(() => {
            this.style.transform = 'rotate(0deg)';
        }, 300);
    });

    // Setup form submission
    document.getElementById('confirm-setup').addEventListener('click', function() {
        const playerName = document.getElementById('player-name').value.trim();
        const computerName = document.getElementById('computer-name').value.trim();
        const rounds = parseInt(document.getElementById('rounds').value);

        // Validation
        if (!playerName) {
            alert('Please enter your name!');
            document.getElementById('player-name').focus();
            return;
        }

        if (!computerName) {
            alert('Please enter a computer opponent name!');
            document.getElementById('computer-name').focus();
            return;
        }

        // Set game state
        gameState.playerName = playerName;
        gameState.computerName = computerName;
        gameState.totalRounds = rounds;
        gameState.currentRound = 1;
        gameState.playerScore = 0;
        gameState.computerScore = 0;
        gameState.gameInProgress = true;

        // Update display
        document.getElementById('player-display-name').textContent = playerName;
        document.getElementById('computer-display-name').textContent = computerName;
        document.getElementById('total-rounds').textContent = rounds;
        document.getElementById('current-round').textContent = '1';
        document.getElementById('player-score').textContent = '0';
        document.getElementById('computer-score').textContent = '0';

        // Reset choice displays
        document.getElementById('player-choice-display').textContent = '?';
        document.getElementById('computer-choice-display').textContent = '?';
        document.getElementById('battle-result').textContent = '';

        // Add button animation
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
            showPage('game-page');
        }, 150);
    });

    // Choice button events
    document.querySelectorAll('.choice-button').forEach(button => {
        button.addEventListener('click', function() {
            if (!gameState.gameInProgress) return;

            const playerChoice = this.dataset.choice;
            playRound(playerChoice);
        });
    });

    // Play again buttons
    document.querySelectorAll('.play-again-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('game-over-overlay').classList.remove('active');
            showPage('setup-page');
            
            // Reset form
            document.getElementById('player-name').value = '';
            document.getElementById('computer-name').value = '';
            document.getElementById('rounds').value = '5';
        });
    });
});

// Play a round
function playRound(playerChoice) {
    if (!gameState.gameInProgress) return;

    // Disable choices temporarily
    gameState.gameInProgress = false;
    
    // Remove previous selections
    document.querySelectorAll('.choice-button').forEach(btn => {
        btn.classList.remove('selected');
    });
    
    // Highlight player choice
    document.querySelector(`[data-choice="${playerChoice}"]`).classList.add('selected');

    // Generate computer choice
    const choices = ['rock', 'paper', 'scissors'];
    const computerChoice = choices[Math.floor(Math.random() * choices.length)];

    // Show choices with animation
    setTimeout(() => {
        updateChoiceDisplay(playerChoice, computerChoice);
        
        // Determine winner and show result
        setTimeout(() => {
            const result = determineWinner(playerChoice, computerChoice);
            showBattleResult(result, playerChoice, computerChoice);
            
            // Update scores
            if (result === 'player') {
                gameState.playerScore++;
                document.getElementById('player-score').textContent = gameState.playerScore;
            } else if (result === 'computer') {
                gameState.computerScore++;
                document.getElementById('computer-score').textContent = gameState.computerScore;
            }

            // Check if game is over
            setTimeout(() => {
                if (gameState.currentRound >= gameState.totalRounds) {
                    endGame();
                } else {
                    // Prepare for next round
                    gameState.currentRound++;
                    document.getElementById('current-round').textContent = gameState.currentRound;
                    gameState.gameInProgress = true;
                    
                    // Reset displays for next round
                    setTimeout(() => {
                        document.getElementById('player-choice-display').textContent = '?';
                        document.getElementById('computer-choice-display').textContent = '?';
                        document.getElementById('battle-result').textContent = '';
                        document.querySelectorAll('.choice-button').forEach(btn => {
                            btn.classList.remove('selected');
                        });
                    }, 1500);
                }
            }, 2000);
        }, 1000);
    }, 500);
}

// Update choice display
function updateChoiceDisplay(playerChoice, computerChoice) {
    const choiceEmojis = {
        rock: '🪨',
        paper: '📄',
        scissors: '✂️'
    };

    const playerDisplay = document.getElementById('player-choice-display');
    const computerDisplay = document.getElementById('computer-choice-display');

    playerDisplay.textContent = choiceEmojis[playerChoice];
    computerDisplay.textContent = choiceEmojis[computerChoice];

    // Add battle animation
    document.getElementById('battle-arena').classList.add('battle-animation');
    setTimeout(() => {
        document.getElementById('battle-arena').classList.remove('battle-animation');
    }, 500);
}

// Determine winner
function determineWinner(playerChoice, computerChoice) {
    if (playerChoice === computerChoice) {
        return 'tie';
    }

    const winConditions = {
        rock: 'scissors',
        paper: 'rock',
        scissors: 'paper'
    };

    return winConditions[playerChoice] === computerChoice ? 'player' : 'computer';
}

// Show battle result with visual representation
function showBattleResult(result, playerChoice, computerChoice) {
    const resultElement = document.getElementById('battle-result');
    let resultText = '';
    let resultClass = '';

    if (result === 'tie') {
        resultText = "It's a Tie!";
        resultClass = 'tie';
    } else if (result === 'player') {
        resultText = getWinDescription(playerChoice, computerChoice, true);
        resultClass = 'win';
        
        // Add win animation to player choice
        document.getElementById('player-choice-display').classList.add('win-animation');
        setTimeout(() => {
            document.getElementById('player-choice-display').classList.remove('win-animation');
        }, 1000);
    } else {
        resultText = getWinDescription(computerChoice, playerChoice, false);
        resultClass = 'lose';
        
        // Add lose animation to player choice
        document.getElementById('player-choice-display').classList.add('lose-animation');
        setTimeout(() => {
            document.getElementById('player-choice-display').classList.remove('lose-animation');
        }, 500);
    }

    resultElement.textContent = resultText;
    resultElement.className = `battle-result ${resultClass}`;
}

// Get win description with visual metaphors
function getWinDescription(winnerChoice, loserChoice, playerWon) {
    const descriptions = {
        'rock-scissors': 'Rock crushes Scissors',
        'paper-rock': 'Paper covers Rock',
        'scissors-paper': 'Scissors cut Paper'
    };

    const key = `${winnerChoice}-${loserChoice}`;
    const description = descriptions[key];
    
    if (playerWon) {
        return `You Win! ${description}! 🎉`;
    } else {
        return `You Lose! ${description}! 😔`;
    }
}

// End game
function endGame() {
    gameState.gameInProgress = false;
    
    const overlay = document.getElementById('game-over-overlay');
    const winCelebration = document.getElementById('win-celebration');
    const loseCelebration = document.getElementById('lose-message');

    // Hide both celebrations first
    winCelebration.style.display = 'none';
    loseCelebration.style.display = 'none';

    if (gameState.playerScore > gameState.computerScore) {
        // Player wins
        const randomWinMessage = winMessages[Math.floor(Math.random() * winMessages.length)];
        document.getElementById('win-message').textContent = randomWinMessage;
        winCelebration.style.display = 'block';
        
        // Add confetti animation
        createConfetti();
    } else if (gameState.computerScore > gameState.playerScore) {
        // Player loses
        const randomLoseMessage = loseMessages[Math.floor(Math.random() * loseMessages.length)];
        document.getElementById('lose-motivational').textContent = randomLoseMessage;
        loseCelebration.style.display = 'block';
    } else {
        // It's a tie - treat as loss with encouraging message
        document.getElementById('lose-motivational').textContent = "A tie shows you're evenly matched! Next time, you'll have the edge you need to win!";
        loseCelebration.style.display = 'block';
    }

    overlay.classList.add('active');
}

// Create confetti effect
function createConfetti() {
    const colors = ['#ffd700', '#ff5722', '#4caf50', '#2196f3', '#9c27b0', '#ff9800'];
    const confettiContainer = document.querySelector('.confetti');
    
    // Clear existing confetti
    confettiContainer.innerHTML = '';
    
    for (let i = 0; i < 20; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = (Math.random() * 2 + 2) + 's';
        confetti.style.animation = 'confettiFall linear infinite';
        confettiContainer.appendChild(confetti);
    }
}

// Add some interactive sound effects (optional - can be enhanced with actual audio)
function playSound(type) {
    // This is a placeholder for sound effects
    // You could implement actual audio here
    console.log(`Playing ${type} sound effect`);
}

// Add keyboard support
document.addEventListener('keydown', function(event) {
    if (!gameState.gameInProgress) return;
    
    switch(event.key.toLowerCase()) {
        case 'r':
            document.querySelector('[data-choice="rock"]').click();
            break;
        case 'p':
            document.querySelector('[data-choice="paper"]').click();
            break;
        case 's':
            document.querySelector('[data-choice="scissors"]').click();
            break;
    }
});

// Add visual feedback for button interactions
document.addEventListener('click', function(event) {
    if (event.target.matches('button') || event.target.matches('.choice-button')) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = event.target.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        // Add ripple styles if not already present
        if (!document.querySelector('style[data-ripple]')) {
            const style = document.createElement('style');
            style.setAttribute('data-ripple', '');
            style.textContent = `
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s linear;
                    pointer-events: none;
                }
                @keyframes ripple-animation {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        event.target.style.position = 'relative';
        event.target.style.overflow = 'hidden';
        event.target.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
});