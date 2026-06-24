// Sound Manager using Web Audio API (Timeline scheduling with robust context unlocking)
class SoundManager {
    constructor() {
        this.ctx = null;
    }

    init() {
        try {
            if (!this.ctx) {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().then(() => {
                    console.log("AudioContext resumed successfully!");
                }).catch(err => {
                    console.error("Failed to resume AudioContext:", err);
                });
            }
        } catch (e) {
            console.error("AudioContext initialization failed:", e);
        }
    }

    playClickAtTime(time) {
        if (!this.ctx) return;
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, time);
            osc.frequency.exponentialRampToValueAtTime(150, time + 0.1);
            
            gain.gain.setValueAtTime(0.15, time);
            gain.gain.exponentialRampToValueAtTime(0.01, time + 0.1);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(time);
            osc.stop(time + 0.1);
        } catch (e) {
            console.error("Error playing click sound:", e);
        }
    }

    playClick() {
        this.init();
        if (this.ctx) {
            this.playClickAtTime(this.ctx.currentTime);
        }
    }

    playSpin(durationMs) {
        this.init();
        if (!this.ctx) return;
        
        try {
            const startTime = this.ctx.currentTime;
            const endTime = startTime + (durationMs / 1000);
            let time = startTime;
            let step = 0.05; // initial timing spacing
            
            while (time < endTime) {
                this.playClickAtTime(time);
                let progress = (time - startTime) / (endTime - startTime);
                // Slowly increase step delay to simulate friction/slowing down of the wheel
                time += step + (progress * 0.18);
            }
        } catch (e) {
            console.error("Error playing spin sound sequence:", e);
        }
    }

    playTimerTick() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const time = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'square';
            osc.frequency.setValueAtTime(600, time);
            
            gain.gain.setValueAtTime(0.06, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start(time);
            osc.stop(time + 0.08);
        } catch (e) {
            console.error("Error playing timer tick sound:", e);
        }
    }

    playTimeOut() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            
            [now, now + 0.25].forEach((time, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(120, time);
                
                gain.gain.setValueAtTime(0.18, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.22);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.22);
            });
        } catch (e) {
            console.error("Error playing timeout sound:", e);
        }
    }

    playChimePlus() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            
            [350, 500, 650].forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + (index * 0.08);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                
                gain.gain.setValueAtTime(0.12, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.15);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.15);
            });
        } catch (e) {
            console.error("Error playing chime plus sound:", e);
        }
    }

    playSuccessChime() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const now = this.ctx.currentTime;
            const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
            
            notes.forEach((freq, index) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                const time = now + (index * 0.08);
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, time);
                
                gain.gain.setValueAtTime(0.15, time);
                gain.gain.exponentialRampToValueAtTime(0.01, time + 0.35);
                
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                
                osc.start(time);
                osc.stop(time + 0.35);
            });
        } catch (e) {
            console.error("Error playing success chime sound:", e);
        }
    }

    playError() {
        this.init();
        if (!this.ctx) return;
        
        try {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(180, this.ctx.currentTime);
            
            gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.3);
            
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            
            osc.start();
            osc.stop(this.ctx.currentTime + 0.3);
        } catch (e) {
            console.error("Error playing error sound:", e);
        }
    }
}

const sounds = new SoundManager();

// Game Configuration & Pools
const AVATAR_POOL = [
    { id: 'tiger', name: 'נמר חביב', img: 'assets/tiger.png' },
    { id: 'robot', name: 'רובוט חכם', img: 'assets/robot.png' },
    { id: 'rabbit', name: 'ארנב מהיר', img: 'assets/rabbit.png' },
    { id: 'fox', name: 'שועל פיקח', img: 'assets/fox.png' },
    { id: 'spaceship', name: 'חללית על', img: 'assets/spaceship.png' },
    { id: 'bear', name: 'דובון מתוק', img: 'assets/bear.png' },
    { id: 'dinosaur', name: 'דינו חמוד', img: 'assets/dinosaur.png' },
    { id: 'elephant', name: 'פילון שמח', img: 'assets/elephant.png' }
];

const LETTERS = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];

const MISSIONS = [
    "הביאו יחד 3 חפצים שונים מהבית שמתחילים באות [אות]!",
    "מצאו בבית חפץ בצבע של האות [אות] והחזיקו אותו יחד!",
    "מצאו בחדר חפץ שמתחיל באות [אות] וגעו בו כולכם בבת אחת!",
    "רוצו יחד למטבח והביאו מאכל או כלי אוכל שמתחיל באות [אות]!",
    "חפשו בבית חפץ עגול, מרובע או משולש שמתחיל באות [אות]!",
    "הביאו מהחדר משחק או בובה ששמם מתחיל באות [אות]!",
    "מצאו ספר בבית, דפדפו יחד ומצאו מילה שמתחילה באות [אות]!",
    "הביאו חפץ קטן שמתחיל באות [אות] שיכול להיכנס לכולכם בתוך כף היד יחד!",
    "צרו יחד בעזרת הגוף שלכם את הצורה של האות [אות]!",
    "בנו יחד מגדל מ-3 קוביות או חפצים שמתחילים באות [אות]!",
    "צרו על השולחן את הצורה של האות [אות] בעזרת חבל, שרוך או אטבים!",
    "קחו דף וציירו יחד (כל אחד קו אחד בתורו) משהו שמתחיל באות [אות]!",
    "השתמשו בכפות הידיים שלכם יחד כדי ליצור את הצורה של האות [אות] באוויר!",
    "פזרו 3 חפצים שמתחילים באות [אות] ואספו אותם יחד בעיניים עצומות!",
    "עטפו יחד חפץ שמתחיל באות [אות] בנייר או מגבת (אחד מחזיק ואחד עוטף)!",
    "צרו 'פסל אנושי' משותף שמזכיר חיה או חפץ שמתחילים באות [אות]!",
    "חשבו יחד על חיה באות [אות] ולכו כמוה ברחבי החדר!",
    "המציאו יחד צליל או קול מוזר שמתחיל באות [אות] והשמיעו אותו יחד ב-3, 2, 1!",
    "עמדו במעגל, החזיקו ידיים, קפצו יחד ושירו יחד את הא-ב עד שאתם מגיעים לאות [אות]!",
    "אמרו יחד ובבת אחת שם של ילד או ילדה שמתחיל באות [אות]!",
    "עשו פרצוף מצחיק או מפחיד של דמות או רגש שמתחילים באות [אות]!",
    "המציאו יחד משפט קצר ומצחיק שכל המילים שבו מתחילות באות [אות]!",
    "שבו בגב אל גב ונסו לקום יחד בלי ידיים, תוך כדי שאתם צועקים מילה שמתחילה באות [אות]!",
    "עברו לצד השני של החדר בהליכה מיוחדת (כמו קפיצות, זחילה) תוך כדי שאתם משמיעים צלילים של האות [אות]!"
];

// Game State Management
const state = {
    groupName: '',
    score: 0,
    selectedAvatar: null,
    activeAvatars: [],
    drawnLetter: '',
    currentMission: '',
    usedLetters: [],
    
    // Timer state
    timerSeconds: 60,
    timerInterval: null,
    isTimerRunning: false,
    
    // UI states
    currentScreen: 'setup', // 'setup', 'gameplay', 'score'
    isSpinning: false,
    wheelRotation: 0
};

// DOM Elements
const elements = {
    bgLetters: document.getElementById('bgLetters'),
    appHeader: document.getElementById('appHeader'),
    homeBtn: document.getElementById('homeBtn'),
    headerTitle: document.getElementById('headerTitle'),
    headerScore: document.getElementById('headerScore'),
    scoreValue: document.getElementById('scoreValue'),
    
    // Screen 1: Setup
    screenSetup: document.getElementById('screenSetup'),
    groupNameInput: document.getElementById('groupNameInput'),
    avatarGrid: document.getElementById('avatarGrid'),
    refreshAvatarsBtn: document.getElementById('refreshAvatarsBtn'),
    setupError: document.getElementById('setupError'),
    startBtn: document.getElementById('startBtn'),
    
    // Screen 2: Gameplay
    screenGameplay: document.getElementById('screenGameplay'),
    fortuneWheel: document.getElementById('fortuneWheel'),
    letterDisplay: document.getElementById('letterDisplay'),
    wheelInstructions: document.getElementById('wheelInstructions'),
    missionCard: document.getElementById('missionCard'),
    missionTeamTitle: document.getElementById('missionTeamTitle'),
    missionText: document.getElementById('missionText'),
    
    // Timer Elements
    timerContainer: document.getElementById('timerContainer'),
    timerProgress: document.getElementById('timerProgress'),
    timerNumber: document.getElementById('timerNumber'),
    addTimeBtn: document.getElementById('addTimeBtn'),
    finishMissionBtn: document.getElementById('finishMissionBtn'),
    skipMissionBtn: document.getElementById('skipMissionBtn'),
    timeOutOverlay: document.getElementById('timeOutOverlay'),
    timeoutRestartBtn: document.getElementById('timeoutRestartBtn'),
    timeoutSkipBtn: document.getElementById('timeoutSkipBtn'),
    
    // Screen 3: Score
    screenScore: document.getElementById('screenScore'),
    scoreAvatarContainer: document.getElementById('scoreAvatarContainer'),
    scoreAvatarImg: document.getElementById('scoreAvatarImg'),
    scoreSlider: document.getElementById('scoreSlider'),
    selectionScoreNum: document.getElementById('selectionScoreNum'),
    selectionStarsRender: document.getElementById('selectionStarsRender'),
    submitScoreBtn: document.getElementById('submitScoreBtn'),
    
    // Dialog & Toast
    homeConfirmDialog: document.getElementById('homeConfirmDialog'),
    cancelHomeBtn: document.getElementById('cancelHomeBtn'),
    confirmHomeBtn: document.getElementById('confirmHomeBtn'),
    toastContainer: document.getElementById('toastContainer'),
    toastIcon: document.getElementById('toastIcon'),
    toastMessage: document.getElementById('toastMessage')
};

// Initialize Application
function init() {
    generateBackgroundLetters();
    loadRandomAvatars();
    setupEventListeners();
    updateHeaderUI();
}

// Generate floating decorative letters in background
function generateBackgroundLetters() {
    elements.bgLetters.innerHTML = '';
    const lettersToFloat = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'כ', 'ל', 'מ', 'נ', 'ס', 'ע', 'פ', 'צ', 'ק', 'ר', 'ש', 'ת'];
    const count = 15;
    
    for (let i = 0; i < count; i++) {
        const span = document.createElement('span');
        span.className = 'floating-letter';
        span.innerText = lettersToFloat[Math.floor(Math.random() * lettersToFloat.length)];
        
        span.style.top = `${Math.random() * 90}%`;
        span.style.left = `${Math.random() * 90}%`;
        span.style.animationDelay = `${Math.random() * 10}s`;
        span.style.animationDuration = `${20 + Math.random() * 15}s`;
        
        elements.bgLetters.appendChild(span);
    }
}

// Load a random set of 6 avatars from the pool (User customization choice)
function loadRandomAvatars() {
    // Shuffle pool and slice 6
    const shuffled = [...AVATAR_POOL].sort(() => 0.5 - Math.random());
    state.activeAvatars = shuffled.slice(0, 6);
    state.selectedAvatar = null;
    
    renderAvatarGrid();
}

// Render the 6 selected avatars in Screen 1
function renderAvatarGrid() {
    elements.avatarGrid.innerHTML = '';
    
    state.activeAvatars.forEach(avatar => {
        const card = document.createElement('div');
        card.className = 'avatar-card';
        card.setAttribute('role', 'radio');
        card.setAttribute('aria-checked', 'false');
        card.setAttribute('tabindex', '0');
        card.dataset.id = avatar.id;
        
        // Cache bust the avatar image using current app version or unique code
        const imgUrl = `${avatar.img}?v=1.0.0`;
        
        card.innerHTML = `
            <div class="avatar-img-container">
                <img src="${imgUrl}" alt="${avatar.name}" class="avatar-img">
            </div>
            <span class="avatar-name">${avatar.name}</span>
        `;
        
        // Select logic
        const selectAction = () => {
            document.querySelectorAll('.avatar-card').forEach(c => {
                c.classList.remove('selected');
                c.setAttribute('aria-checked', 'false');
            });
            card.classList.add('selected');
            card.setAttribute('aria-checked', 'true');
            state.selectedAvatar = avatar;
            elements.setupError.style.display = 'none';
            sounds.playClick();
        };
        
        card.addEventListener('click', selectAction);
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                selectAction();
            }
        });
        
        elements.avatarGrid.appendChild(card);
    });
}

// Update sticky header based on active screen and state
function updateHeaderUI() {
    if (state.currentScreen === 'setup') {
        elements.homeBtn.classList.add('hidden');
        elements.headerTitle.innerText = 'סיירת א-ב ⭐️';
        elements.headerScore.classList.add('hidden');
    } else {
        elements.homeBtn.classList.remove('hidden');
        elements.headerTitle.innerText = state.groupName;
        elements.headerScore.classList.remove('hidden');
        elements.scoreValue.innerText = state.score;
    }
}

// Show validation or error message
function showError(message) {
    elements.setupError.innerText = message;
    elements.setupError.style.display = 'block';
    sounds.playError();
}

// Navigate between screens
function navigateTo(screenId) {
    state.currentScreen = screenId;
    
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    
    if (screenId === 'setup') {
        elements.screenSetup.classList.add('active');
    } else if (screenId === 'gameplay') {
        elements.screenGameplay.classList.add('active');
        // Reset local screen states if coming fresh
        if (!state.isTimerRunning && state.drawnLetter === '') {
            resetGameplayUI();
        }
    } else if (screenId === 'score') {
        elements.screenScore.classList.add('active');
        setupScoreScreen();
    }
    
    updateHeaderUI();
}

// Reset the gameplay UI to its initial "unrolled" state
function resetGameplayUI() {
    elements.letterDisplay.innerText = '?';
    elements.wheelInstructions.innerText = 'לחצו על הגלגל להגרלת אות!';
    elements.missionTeamTitle.innerText = `צוות ${state.groupName}, צאו לדרך!`;
    elements.missionText.innerText = 'סובבו את הגלגל למעלה כדי לקבל משימה חדשה...';
    
    resetTimer(false);
    elements.addTimeBtn.disabled = true;
    elements.finishMissionBtn.disabled = true;
    elements.skipMissionBtn.disabled = true;
}

// Event Listeners setup
function setupEventListeners() {
    // Header home click
    elements.homeBtn.addEventListener('click', () => {
        if (state.currentScreen !== 'setup') {
            elements.homeConfirmDialog.style.display = 'flex';
            sounds.playClick();
        }
    });

    // Dialog cancel
    elements.cancelHomeBtn.addEventListener('click', () => {
        elements.homeConfirmDialog.style.display = 'none';
        sounds.playClick();
    });

    // Dialog confirm
    elements.confirmHomeBtn.addEventListener('click', () => {
        elements.homeConfirmDialog.style.display = 'none';
        resetGameToSetup();
        sounds.playClick();
    });

    // Setup: Refresh avatars
    elements.refreshAvatarsBtn.addEventListener('click', () => {
        loadRandomAvatars();
        sounds.playClick();
    });

    // Setup: Start button
    elements.startBtn.addEventListener('click', () => {
        const nameInput = elements.groupNameInput.value.trim();
        
        if (!nameInput) {
            showError('אנא הכניסו שם לקבוצה ובחרו אוואטר כדי שנוכל להתחיל!');
            return;
        }
        
        if (!state.selectedAvatar) {
            showError('אנא בחרו אוואטר חמוד לקבוצה שלכם כדי שנוכל להתחיל!');
            return;
        }
        
        state.groupName = nameInput;
        navigateTo('gameplay');
        sounds.playClick();
    });

    // Gameplay: Spin wheel
    elements.fortuneWheel.addEventListener('click', () => {
        if (state.isSpinning) return;
        spinWheel();
    });

    // Gameplay: Add 10 seconds
    elements.addTimeBtn.addEventListener('click', () => {
        addTimerTime(10);
    });

    // Gameplay: Skip/Change mission
    elements.skipMissionBtn.addEventListener('click', () => {
        skipMission();
    });

    // Gameplay: Finish mission
    elements.finishMissionBtn.addEventListener('click', () => {
        finishMission();
    });

    // Timeout: Restart timer
    elements.timeoutRestartBtn.addEventListener('click', () => {
        elements.timeOutOverlay.style.display = 'none';
        resetTimer(true);
        sounds.playClick();
    });

    // Timeout: Skip mission
    elements.timeoutSkipBtn.addEventListener('click', () => {
        elements.timeOutOverlay.style.display = 'none';
        spinWheel(); // Roll a new letter & mission
    });

    // Score: Slider drag change
    elements.scoreSlider.addEventListener('input', updateSliderSelectionDisplay);
    
    // Score: Submit button click
    elements.submitScoreBtn.addEventListener('click', () => {
        const val = parseInt(elements.scoreSlider.value);
        submitStarsScore(val);
    });
}

// Reset entire game state and navigate to screen 1
function resetGameToSetup() {
    stopTimer();
    state.score = 0;
    state.groupName = '';
    state.selectedAvatar = null;
    state.drawnLetter = '';
    state.currentMission = '';
    state.usedLetters = [];
    elements.groupNameInput.value = '';
    
    loadRandomAvatars();
    navigateTo('setup');
}

// Spin Wheel Logic
function spinWheel() {
    sounds.init();
    state.isSpinning = true;
    elements.wheelInstructions.innerText = 'מגרילים אות... 🍀';
    elements.missionText.innerText = 'מסתובב... היכונו לפעולה!';
    
    elements.addTimeBtn.disabled = true;
    elements.finishMissionBtn.disabled = true;
    elements.skipMissionBtn.disabled = true;
    
    // Reset timer graphics during spin
    resetTimer(false);

    // Pick a letter not recently used
    let availableLetters = LETTERS.filter(l => !state.usedLetters.includes(l));
    if (availableLetters.length === 0) {
        state.usedLetters = []; // Reset pool if all used
        availableLetters = LETTERS;
    }
    
    const letter = availableLetters[Math.floor(Math.random() * availableLetters.length)];
    state.drawnLetter = letter;
    state.usedLetters.push(letter);

    // Add multiple rotations for effect (e.g. 5-7 spins + snap degree)
    const spins = 5 + Math.floor(Math.random() * 3);
    const degreeOffset = LETTERS.indexOf(letter) * (360 / LETTERS.length);
    state.wheelRotation += (spins * 360) + degreeOffset;
    
    // Apply rotation transition
    elements.fortuneWheel.style.transform = `rotate(${state.wheelRotation}deg)`;
    
    // Sound loop simulation
    sounds.playSpin(3000);
    
    // Rapid text shuffling effect during spin
    let shuffleInterval = setInterval(() => {
        const randLetter = LETTERS[Math.floor(Math.random() * LETTERS.length)];
        elements.letterDisplay.innerText = randLetter;
    }, 80);
    
    // Spin finish
    setTimeout(() => {
        clearInterval(shuffleInterval);
        elements.letterDisplay.innerText = letter;
        state.isSpinning = false;
        
        // Choose and show mission
        generateMissionForLetter(letter);
        
        // Enable buttons and start countdown timer
        elements.addTimeBtn.disabled = false;
        elements.finishMissionBtn.disabled = false;
        elements.skipMissionBtn.disabled = false;
        
        elements.wheelInstructions.innerText = 'האות הוגרלה! לחצו שוב להגרלה חדשה.';
        
        startTimer(60);
    }, 3000);
}

// Select a random mission for the current letter and format it
function generateMissionForLetter(letter) {
    const randomMissionTemplate = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    
    // Highlight letter using a styled span
    const highlightSpan = `<span class="mission-letter-highlight">${letter}'</span>`;
    
    state.currentMission = randomMissionTemplate.replace(/\[אות\]/g, highlightSpan).replace(/\[האות שנבחרה\]/g, highlightSpan);
    
    elements.missionTeamTitle.innerText = `צוות ${state.groupName}, המשימה שלכם:`;
    elements.missionText.innerHTML = state.currentMission;
}

// Timer Logic
function startTimer(durationSeconds) {
    stopTimer();
    
    state.timerSeconds = durationSeconds;
    state.isTimerRunning = true;
    
    updateTimerDisplay();
    
    elements.timerContainer.classList.remove('timer-alert', 'timer-pulsating');
    
    state.timerInterval = setInterval(() => {
        state.timerSeconds--;
        
        if (state.timerSeconds <= 10 && state.timerSeconds > 0) {
            elements.timerContainer.classList.add('timer-alert', 'timer-pulsating');
            sounds.playTimerTick();
        }
        
        if (state.timerSeconds <= 0) {
            stopTimer();
            handleTimerTimeout();
        }
        
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (state.timerInterval) {
        clearInterval(state.timerInterval);
        state.timerInterval = null;
    }
    state.isTimerRunning = false;
}

function resetTimer(startImmediate = false) {
    stopTimer();
    state.timerSeconds = 60;
    updateTimerDisplay();
    elements.timerContainer.classList.remove('timer-alert', 'timer-pulsating');
    
    if (startImmediate) {
        startTimer(60);
    }
}

function updateTimerDisplay() {
    const mins = Math.floor(state.timerSeconds / 60);
    const secs = state.timerSeconds % 60;
    
    elements.timerNumber.innerText = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    
    // SVG Progress Arc offset
    const maxOffset = 282.7; // 2 * PI * 45
    // Clamp between 0 and 60 for visual progress percent representation
    const timeRatio = Math.max(0, Math.min(60, state.timerSeconds)) / 60;
    const offset = maxOffset * (1 - timeRatio);
    elements.timerProgress.style.strokeDashoffset = offset;
}

function addTimerTime(secondsToAdd) {
    if (!state.isTimerRunning) return;
    
    state.timerSeconds += secondsToAdd;
    // Cap timer visual progress max representation
    if (state.timerSeconds > 99) state.timerSeconds = 99;
    
    // If we were in alert zone but are now above 10, clean UI indicators
    if (state.timerSeconds > 10) {
        elements.timerContainer.classList.remove('timer-alert', 'timer-pulsating');
    }
    
    updateTimerDisplay();
    sounds.playChimePlus();
    showToast(`⏱️ נוספו עוד ${secondsToAdd} שניות! קדימה!`);
}

function handleTimerTimeout() {
    sounds.playTimeOut();
    elements.timeOutOverlay.style.display = 'flex';
}

// Skip Mission: Roll a different mission for the SAME letter
function skipMission() {
    stopTimer();
    sounds.playClick();
    
    // Draw a new mission for the same letter
    generateMissionForLetter(state.drawnLetter);
    resetTimer(true); // Restart timer immediately
    showToast('🔄 משימה הוחלפה! הטיימר התאפס ל-60 שניות.');
}

// Finish Mission: Transition to Screen 3
function finishMission() {
    stopTimer();
    sounds.playClick();
    navigateTo('score');
}

// Screen 3: Score Panel Setup
function setupScoreScreen() {
    // Show selected avatar
    const imgUrl = `${state.selectedAvatar.img}?v=1.0.1`;
    elements.scoreAvatarImg.src = imgUrl;
    elements.scoreAvatarImg.alt = state.selectedAvatar.name;
    elements.scoreAvatarImg.classList.remove('avatar-bounce'); // Clear old anims
    
    // Reset score slider to default middle value (3)
    elements.scoreSlider.value = 3;
    updateSliderSelectionDisplay();
}

// Update the dynamic score select display bubble card
function updateSliderSelectionDisplay() {
    const val = parseInt(elements.scoreSlider.value);
    elements.selectionScoreNum.innerText = val;
    
    // Generate stars render (Pyramid style for 5 stars, otherwise inline)
    let starsHtml = '';
    if (val === 5) {
        starsHtml = `
            <div style="display: flex; flex-direction: column; align-items: center; line-height: 1.1;">
                <div>⭐⭐⭐</div>
                <div>⭐⭐</div>
            </div>
        `;
    } else {
        starsHtml = '⭐'.repeat(val);
    }
    elements.selectionStarsRender.innerHTML = starsHtml;
}

// Submit score from slider (1 to 5)
function submitStarsScore(value) {
    state.score += value;
    updateHeaderUI();
    
    // Sound chime effect
    sounds.playSuccessChime();
    
    // Trigger bounce animation on Avatar
    elements.scoreAvatarImg.classList.add('avatar-bounce');
    
    showToast(`🌟 יש! הוספתם ${value} נקודות לקופת הנקודות!`, '🏆');
    
    // After 2 seconds of joy, navigate back to Screen 2
    setTimeout(() => {
        elements.scoreAvatarImg.classList.remove('avatar-bounce');
        navigateTo('gameplay');
        resetGameplayUI();
    }, 2000);
}

// Show dynamic toast notification popup
function showToast(message, icon = '✨') {
    elements.toastIcon.innerText = icon;
    elements.toastMessage.innerText = message;
    
    elements.toastContainer.classList.add('show');
    
    setTimeout(() => {
        elements.toastContainer.classList.remove('show');
    }, 3000);
}

// Unlocking browser audio policies on first user interaction
const unlockAudio = () => {
    sounds.init();
    // Play a short silent note to trigger browser audio state resolution
    if (sounds.ctx) {
        try {
            const osc = sounds.ctx.createOscillator();
            const gain = sounds.ctx.createGain();
            gain.gain.setValueAtTime(0.0001, sounds.ctx.currentTime);
            osc.connect(gain);
            gain.connect(sounds.ctx.destination);
            osc.start();
            osc.stop(sounds.ctx.currentTime + 0.01);
        } catch (e) {
            console.error("Audio unlock silent note failed:", e);
        }
    }
    document.removeEventListener('click', unlockAudio);
    document.removeEventListener('touchstart', unlockAudio);
};
document.addEventListener('click', unlockAudio);
document.addEventListener('touchstart', unlockAudio);

// Run app init on DOM Content Loaded
document.addEventListener('DOMContentLoaded', init);
