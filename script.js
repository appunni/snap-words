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
            slot.className = 'w-14 h-14 border-4 border-dashed border-indigo-300 rounded-xl flex items-center justify-center text-2xl bg-indigo-50/30 transition-all duration-200 hover:border-indigo-400 hover:bg-indigo-50/50 before:content-["_"] before:text-indigo-300 before:animate-pulse';
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

            // Add click/tap handler with improved animation
            tile.addEventListener('click', () => {
                const emptySlot = this.wordDisplay.querySelector('[data-slot]:empty');
                if (emptySlot) {
                    // Get positions for animation
                    const tileRect = tile.getBoundingClientRect();
                    const slotRect = emptySlot.getBoundingClientRect();

                    // Create moving clone
                    const clone = tile.cloneNode(true);
                    clone.style.position = 'fixed';
                    clone.style.left = `${tileRect.left}px`;
                    clone.style.top = `${tileRect.top}px`;
                    clone.style.width = `${tileRect.width}px`;
                    clone.style.height = `${tileRect.height}px`;
                    clone.style.zIndex = '50';
                    clone.style.transition = 'all 0.4s ease-in-out';
                    document.body.appendChild(clone);

                    // Start animation
                    requestAnimationFrame(() => {
                        clone.classList.add('animate-moveToSlot');
                        clone.style.transform = `translate(${slotRect.left - tileRect.left}px, ${slotRect.top - tileRect.top}px)`;
                    });

                    // Update slot after animation
                    setTimeout(() => {
                        emptySlot.textContent = letter;
                        emptySlot.dataset.letter = letter;
                        clone.remove();
                        tile.remove();
                        this.checkWin();
                    }, 400);
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
                // Handle essential actions first
                this.wrongAttemptElement.style.display = 'none';
                this.wrongAttemptShown = false;

                // Show buttons and success message immediately
                if (this.wordCount < this.maxWords) {
                    this.nextButton.style.display = 'inline-block';
                } else {
                    this.messageElement.textContent = '🏆 Congratulations! You completed all words!';
                    this.playAgainButton.style.display = 'inline-block';
                }

                // Show success message
                const messages = [
                    '🎉 Fantastic job!',
                    '⭐️ You\'re amazing!',
                    '🌟 Super duper!',
                    '🎯 Perfect match!',
                    '🎨 Brilliant work!'
                ];
                if (this.wordCount < this.maxWords) {
                    this.messageElement.textContent = messages[Math.floor(Math.random() * messages.length)];
                }

                // Handle animations after essential UI updates
                const slots = Array.from(this.wordDisplay.children);
                slots.forEach((slot, index) => {
                    setTimeout(() => {
                        slot.classList.add('animate-success');
                        this.createConfetti(slot);
                    }, index * 200);
                });

                setTimeout(() => {
                    slots.forEach(slot => slot.classList.remove('animate-success'));
                }, (slots.length * 200) + 500);
            } else if (!this.wrongAttemptShown) {
                // Wrong attempt - provide visual feedback
                const slots = Array.from(this.wordDisplay.children);
                let correctLetters = 0;

                // Analyze each letter and show feedback
                slots.forEach((slot, index) => {
                    const attemptLetter = slot.dataset.letter;
                    const correctLetter = this.currentWord[index];

                    if (attemptLetter === correctLetter) {
                        slot.classList.add('bg-green-100', 'border-green-400');
                        slot.classList.remove('border-dashed', 'border-indigo-300', 'bg-indigo-50/30');
                        correctLetters++;
                    } else {
                        slot.classList.add('bg-red-100', 'border-red-400', 'animate-shake');
                        slot.classList.remove('border-dashed', 'border-indigo-300', 'bg-indigo-50/30');
                    }
                });

                // Show encouraging message based on how close they were
                const progress = Math.round((correctLetters / this.currentWord.length) * 100);
                let message;
                if (progress >= 75) {
                    message = `🌟 So close! ${correctLetters} out of ${this.currentWord.length} letters are correct!`;
                } else if (progress >= 50) {
                    message = `⭐️ Good try! You got ${correctLetters} letters right!`;
                } else if (progress >= 25) {
                    message = `💫 Keep going! ${correctLetters} letters match!`;
                } else {
                    message = "🌱 Let's try a different arrangement!";
                }
                this.messageElement.textContent = message;

                // Show wrong attempt element with animation
                this.wrongAttemptElement.style.display = 'block';
                this.wrongAttemptElement.classList.add('animate-bounce-once');
                this.wrongAttemptShown = true;

                // Remove animations after they complete
                setTimeout(() => {
                    slots.forEach(slot => {
                        slot.classList.remove('animate-shake');
                    });
                    this.wrongAttemptElement.classList.remove('animate-bounce-once');
                }, 1000);
            }
        }
    }

    createConfetti(element) {
        const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        const rect = element.getBoundingClientRect();

        for (let i = 0; i < 10; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'absolute w-2 h-2 rounded-full animate-confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = `${rect.left + rect.width / 2 + (Math.random() * 20 - 10)}px`;
            confetti.style.top = `${rect.top + rect.height / 2}px`;
            document.body.appendChild(confetti);

            // Remove confetti after animation
            setTimeout(() => confetti.remove(), 1000);
        }
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SnapWordGame();
});
