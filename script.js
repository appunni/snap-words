// List of snap words
const snapWords = [
    // Animals
    'ant', 'bear', 'bird', 'bull', 'cat', 'cow', 'crab', 'deer', 'dog', 'duck',
    'fish', 'frog', 'goat', 'lion', 'owl', 'pig', 'seal', 'swan', 'wolf', 'zebra',

    // Colors & Appearance
    'big', 'blue', 'dark', 'gold', 'gray', 'green', 'pink', 'red', 'tall', 'white',

    // Actions
    'bake', 'bite', 'call', 'clap', 'draw', 'drum', 'jump', 'kick', 'read', 'ride',
    'roll', 'run', 'sing', 'skip', 'swim', 'walk', 'wave', 'wink', 'work', 'yawn',

    // Nature
    'bush', 'cloud', 'hill', 'lake', 'leaf', 'moon', 'rain', 'rock', 'sand', 'seed',
    'sky', 'star', 'sun', 'tree', 'wave', 'wind', 'wood', 'yard',

    // Objects
    'bag', 'ball', 'bell', 'bike', 'book', 'bowl', 'box', 'cake', 'card', 'chair',
    'cup', 'desk', 'door', 'drum', 'flag', 'food', 'fork', 'game', 'gift', 'hat',
    'key', 'lamp', 'lock', 'mask', 'pen', 'ring', 'ship', 'shoe', 'tent', 'toy',

    // Feelings & Qualities
    'bad', 'bold', 'busy', 'calm', 'cool', 'cute', 'fair', 'fast', 'glad', 'good',
    'happy', 'kind', 'nice', 'sad', 'safe', 'shy', 'slow', 'soft', 'warm', 'wise',

    // Family & People
    'aunt', 'baby', 'boy', 'dad', 'girl', 'king', 'kid', 'man', 'mom', 'twin'
];

class SnapWordGame {
    constructor() {
        this.initializeElements();
        this.addStartGameListener();
        this.initializeVoices();
        this.wrongAttemptShown = false;

    }

    initializeElements() {
        // Start screen elements
        this.startButton = document.getElementById('startButton');
        this.startScreen = document.getElementById('startScreen');
        this.gameContent = document.getElementById('gameContent');

        // Game elements
        this.wordDisplay = document.getElementById('wordDisplay');
        this.letterBank = document.getElementById('letterBank');
        this.hintButton = document.getElementById('hintButton');
        this.resetButton = document.getElementById('resetButton');
        this.nextButton = document.getElementById('nextButton');
        this.playAgainButton = document.getElementById('playAgainButton');
        this.messageElement = document.getElementById('message');
        this.wordCountElement = document.getElementById('wordCount');
        this.wrongAttemptElement = document.getElementById('wrongAttempt');
        this.retryButton = document.getElementById('retryButton');
        this.skipButton = document.getElementById('skipButton');

        // Game state
        this.currentWord = '';
        this.wordCount = 1;
        this.maxWords = 5;
        this.usedWords = [];
    }

    addStartGameListener() {
        this.startButton.addEventListener('click', () => {
            this.startScreen.style.display = 'none';
            this.gameContent.style.display = 'block';
            this.setupEventListeners();
            this.startNewRound();
        });
    }

    setupEventListeners() {
        this.hintButton.addEventListener('click', () => this.speakWord());
        this.resetButton.addEventListener('click', () => this.resetCurrentWord());
        this.nextButton.addEventListener('click', () => this.nextWord());
        this.playAgainButton.addEventListener('click', () => this.startNewRound());
        this.retryButton.addEventListener('click', () => this.retryWord());
        this.skipButton.addEventListener('click', () => this.nextWord());
    }

    setupGame() {
        this.currentWord = this.getRandomWord();
        this.createWordDisplay();
        this.createLetterTiles();
        this.setupDragAndDrop();
        this.updateWordCount();
        this.speakWord(); // Speak word immediately when shown
        this.wrongAttemptShown = false;
        this.wrongAttemptElement.style.display = 'none';
    }

    getRandomWord() {
        const availableWords = snapWords.filter(word => !this.usedWords.includes(word));
        const randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
        this.usedWords.push(randomWord);
        return randomWord;
    }

    createWordDisplay() {
        this.wordDisplay.innerHTML = '';
        [...this.currentWord].forEach(() => {
            const slot = document.createElement('div');
            slot.className = 'w-14 h-14 border-3 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-2xl bg-gray-50 transition-colors duration-200';
            slot.dataset.letter = '';
            slot.dataset.slot = 'true';
            this.wordDisplay.appendChild(slot);
        });
    }

    createLetterTiles() {
        this.letterBank.innerHTML = '';
        const letters = [...this.currentWord].sort(() => Math.random() - 0.5);
        letters.forEach(letter => {
            const tileColors = [
                'from-blue-400 to-blue-500',
                'from-green-400 to-green-500',
                'from-purple-400 to-purple-500',
                'from-pink-400 to-pink-500',
                'from-indigo-400 to-indigo-500'
            ];
            const randomColor = tileColors[Math.floor(Math.random() * tileColors.length)];

            const tile = document.createElement('div');
            tile.className = `w-14 h-14 bg-gradient-to-br ${randomColor} text-white rounded-xl flex items-center justify-center text-2xl cursor-pointer select-none transform transition-all duration-200 hover:scale-110 active:scale-95`;
            tile.dataset.tile = 'true';
            tile.textContent = letter;

            // Add click/tap handler with animation
            tile.addEventListener('click', () => {
                const emptySlot = this.wordDisplay.querySelector('[data-slot]:empty');
                if (emptySlot) {
                    tile.classList.add('animate-bounce');
                    setTimeout(() => {
                        emptySlot.textContent = letter;
                        emptySlot.dataset.letter = letter;
                        tile.remove();
                        this.checkWin();
                    }, 300);
                }
            });
            this.letterBank.appendChild(tile);
        });
    }

    setupDragAndDrop() {
        // No longer needed, but keeping the method for compatibility
    }

    initializeVoices() {
        this.femaleVoice = null;
        if ('speechSynthesis' in window) {
            // Load voices and find female English voice
            const loadVoices = () => {
                const voices = speechSynthesis.getVoices();
                this.femaleVoice = voices.find(voice =>
                    voice.lang.includes('en') &&
                    (voice.name.toLowerCase().includes('female') ||
                        voice.name.toLowerCase().includes('samantha'))
                );
            };

            // Voice list might load asynchronously
            speechSynthesis.onvoiceschanged = loadVoices;
            loadVoices(); // Also try loading immediately
        }
    }

    speakWord() {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(this.currentWord);
            utterance.lang = 'en-US';
            utterance.rate = 0.8;  // Slightly slower for clarity
            utterance.pitch = 1.1; // Slightly higher pitch

            // Use female voice if available
            if (this.femaleVoice) {
                utterance.voice = this.femaleVoice;
            }

            speechSynthesis.speak(utterance);
        }
    }

    retryWord() {
        this.wrongAttemptElement.style.display = 'none';
        this.wrongAttemptShown = false;
        this.resetCurrentWord();
    }

    resetCurrentWord() {
        const slots = this.wordDisplay.querySelectorAll('[data-slot]');
        slots.forEach(slot => {
            slot.textContent = '';
            slot.dataset.letter = '';
        });

        this.createLetterTiles();
        this.messageElement.textContent = '';
        this.nextButton.style.display = 'none';
        this.wrongAttemptElement.style.display = 'none';
        this.wrongAttemptShown = false;
    }

    nextWord() {
        this.wordCount++;
        this.updateWordCount();
        this.messageElement.textContent = '';
        this.nextButton.style.display = 'none';
        this.wrongAttemptElement.style.display = 'none';
        this.wrongAttemptShown = false;
        this.setupGame();
    }

    startNewRound() {
        this.wordCount = 1;
        this.usedWords = [];
        this.updateWordCount();
        this.messageElement.textContent = '';
        this.nextButton.style.display = 'none';
        this.playAgainButton.style.display = 'none';
        this.wrongAttemptElement.style.display = 'none';
        this.wrongAttemptShown = false;
        this.setupGame();
    }

    updateWordCount() {
        this.wordCountElement.textContent = this.wordCount;
    }

    checkWin() {
        const currentAttempt = Array.from(this.wordDisplay.children)
            .map(slot => slot.dataset.letter)
            .join('');

        // Check if all slots are filled
        const isComplete = !Array.from(this.wordDisplay.children)
            .some(slot => slot.dataset.letter === '');

        if (isComplete) {
            if (currentAttempt === this.currentWord) {
                // Correct attempt
                this.wrongAttemptElement.style.display = 'none';
                this.wrongAttemptShown = false;
                const messages = [
                    '🎉 Fantastic job!',
                    '⭐️ You\'re amazing!',
                    '🌟 Super duper!',
                    '🎯 Perfect match!',
                    '🎨 Brilliant work!'
                ];
                this.messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
                this.wordDisplay.classList.add('animate-celebration');

                setTimeout(() => {
                    this.wordDisplay.classList.remove('animate-celebration');

                    if (this.wordCount < this.maxWords) {
                        this.nextButton.style.display = 'inline-block';
                    } else {
                        this.messageElement.textContent = '🏆 Congratulations! You completed all words!';
                        this.playAgainButton.style.display = 'inline-block';
                    }
                }, 1500);
            } else if (!this.wrongAttemptShown) {
                // Wrong attempt - show feedback options
                this.wrongAttemptElement.style.display = 'block';
                this.wrongAttemptShown = true;
            }
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnapWordGame();
});
