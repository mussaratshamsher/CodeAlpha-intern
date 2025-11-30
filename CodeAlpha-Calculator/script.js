const resultInput = document.getElementById('result');
const buttons = document.querySelectorAll('.buttons button');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

// Optional audio file (use if present in the project folder)
const clickAudio = new Audio('keyboard-click.mp3');
clickAudio.preload = 'auto';
clickAudio.volume = 0.2;

let expression = '';

// Function to resume audio context and unlock audio playback on user gesture
function resumeAudio() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    // Try to unlock the HTMLAudioElement by briefly playing and pausing it
    try {
        clickAudio.play().then(() => {
            clickAudio.pause();
            clickAudio.currentTime = 0;
        }).catch(() => {
            // ignore playback errors
        });
    } catch (e) {
        // ignore
    }

    // Remove the event listeners after the first gesture
    document.removeEventListener('click', resumeAudio);
    document.removeEventListener('keydown', resumeAudio);
}

// Add event listeners to resume audio on first interaction
document.addEventListener('click', resumeAudio);
document.addEventListener('keydown', resumeAudio);


buttons.forEach(button => {
    button.addEventListener('click', () => {
        const value = button.dataset.value;
        handleInput(value);
        playSound();
    });
});

document.addEventListener('keydown', (event) => {
    const key = event.key;
    const validKeys = '0123456789./*-%^';
    let processed = false;

    if (validKeys.includes(key)) {
        handleInput(key);
        processed = true;
    } else if (key === 'Enter' || key === '=') {
        handleInput('=');
        processed = true;
    } else if (key === 'Backspace') {
        handleInput('DEL');
        processed = true;
    } else if (key.toLowerCase() === 'c') {
        handleInput('AC');
        processed = true;
    }

    if (processed) playSound();
});

function handleInput(value) {
    // Clear 'Error' state on next valid input (except AC)
    if (expression === 'Error' && value !== 'AC' && value !== 'DEL') {
        expression = '';
    }

    if (value === 'AC') {
        expression = '';
    } else if (value === 'DEL') {
        expression = expression.slice(0, -1);
    } else if (value === '=') {
        try {
            // Support single caret exponent like 2^3
            if (expression.includes('^')) {
                const parts = expression.split('^');
                if (parts.length === 2 && parts[0].trim() !== '' && parts[1].trim() !== '') {
                    const base = parseFloat(parts[0]);
                    const exponent = parseFloat(parts[1]);
                    if (isNaN(base) || isNaN(exponent)) {
                        throw new Error('Invalid exponent');
                    }
                    expression = Math.pow(base, exponent).toString();
                } else {
                    throw new Error('Malformed exponent expression');
                }
            } else {
                // Basic eval for arithmetic expressions built from button/input values
                expression = eval(expression).toString();
            }
        } catch (error) {
            expression = 'Error';
        }
    } else {
        // Append the value (including '^' caret) to build the expression
        expression += value;
    }

    resultInput.value = expression;
}

function playSound() {
    // Prefer the downloaded audio file if present; clone node so simultaneous plays don't interrupt each other
    try {
        if (clickAudio && typeof clickAudio.cloneNode === 'function') {
            const audioNode = clickAudio.cloneNode();
            audioNode.volume = 0.18;
            const playPromise = audioNode.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(() => {
                    // fallback to oscillator if HTMLAudio cannot play
                    fallbackOscillator();
                });
            }
            return;
        }
    } catch (e) {
        // fallthrough to oscillator
    }

    // Fallback: short oscillator beep
    fallbackOscillator();
}

function fallbackOscillator() {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(220, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.06, audioContext.currentTime);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.06);
}