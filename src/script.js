let counter = 0; // Game counter
let lastPressedButton = null; // Track which button was last pressed
let gameActive = false; // Flag to control the game state
let sound = document.getElementById("yeahSound");

const gameSequence = [showButtonGame, showWordGame, showFlappyGame, showWeightGame, showCircleGame, showRPSGame, showPuzzleGame, showArcheryGame, showDefuseGame, showStarRatingGame, showEndGame];

let currentGameIndex = 0;

let isCountdownActive = false;

function showCountdownPopup(seconds) {
  if (isCountdownActive) return; // Prevent multiple countdowns

  isCountdownActive = true;

  let popup = document.createElement("div");
  popup.id = "countdownPopup";
  document.body.appendChild(popup);

  const updateText = () => {
    popup.textContent = `Next game in ${seconds}...`;
  };
  updateText();
  const interval = setInterval(() => {
    seconds--;
    if (seconds > 0) {
      updateText();
    } else {
      clearInterval(interval);
      popup.remove();
      isCountdownActive = false; // Allow nextGame again
    }
  }, 1000);
}

function nextGame(delay = 0) {
  if (isCountdownActive) return; // Block if popup is active

  if (delay > 0) {
    showCountdownPopup(Math.ceil(delay / 1000));
  }

  setTimeout(() => {
    if (currentGameIndex < gameSequence.length) {
      gameSequence[currentGameIndex++]();
    }
  }, delay);
}

// Function to show the welcome modal
window.onload = function () {
  document.getElementById("welcomeModal").style.display = "block";
};

const correctPassword = "geil"; // Change this to your desired password

document.getElementById("passwordInput").addEventListener("input", function () {
  const startButton = document.getElementById("startButton");
  const entered = this.value.trim();
  startButton.disabled = entered !== correctPassword;
});

function startGame() {
  document.getElementById("welcomeModal").style.display = "none";
  currentGameIndex = 0;
  nextGame(); // start with the first game
}

function showButtonGame() {
  document.getElementById("game").style.display = "block";
  sound.pause();
  sound = document.getElementById("buttonSound");
  sound.loop = true;
  sound.play();
  counter = 0;
  lastPressedButton = null;
  gameActive = true;
  document.getElementById("button1").disabled = false;
  document.getElementById("button2").disabled = false;
  document.getElementById("counterDisplay").textContent = "Zähler: 0";
  document.getElementById("status").textContent = "";
}

// Function that handles button press
function buttonPressed(buttonNumber) {
  if (!gameActive) return; // Ignore clicks after the game is over

  // Check if the correct button is pressed
  if (buttonNumber === 1 && lastPressedButton !== 1) {
    counter++;
    lastPressedButton = 1;
  } else if (buttonNumber === 2 && lastPressedButton !== 2) {
    counter++;
    lastPressedButton = 2;
  } else {
    // Incorrect order, reset counter
    counter = 0;
    document.getElementById("status").textContent = "Falsch! Nochmal neu";
    lastPressedButton = null;
  }

  // Update counter display
  document.getElementById("counterDisplay").textContent = "Zähler: " + counter;

  if (counter === 69) {
    gameActive = false;
    document.getElementById("status").textContent = "Yay! Du hast die 69 geschafft!";
    document.getElementById("button1").disabled = true;
    document.getElementById("button2").disabled = true;
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  }
}

// --- Word Puzzle Game Logic ---
const correctWord = "APEROL";
let currentWord = "";

function showWordGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("wordGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("wordSound");
  sound.loop = true;
  sound.play();
  const shuffledWord = "LERAPO";
  const shuffled = shuffledWord.split("");
  const letterContainer = document.getElementById("letterContainer");
  letterContainer.innerHTML = "";

  shuffled.forEach((letter) => {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.classList.add("letter-button");
    btn.onclick = () => letterClick(letter, btn);
    letterContainer.appendChild(btn);
  });

  currentWord = "";
  updateCurrentWordDisplay();
  document.getElementById("wordStatus").textContent = "";
}

function letterClick(letter, button) {
  currentWord += letter;
  button.disabled = true;
  button.classList.add("used-letter");
  updateCurrentWordDisplay();

  if (currentWord.length === correctWord.length) {
    if (currentWord === correctWord) {
      document.getElementById("wordStatus").textContent = "🎉 Gewonnen, was eine Saufnase!";
      document.getElementById("wordStatus").style.color = "green";
      sound.pause();
      sound.pause();
      sound = document.getElementById("yeahSound");
      sound.loop = false;
      sound.play();
      nextGame(5000);
    } else {
      document.getElementById("wordStatus").textContent = "❌ Falsch! Sammal?";
      document.getElementById("wordStatus").style.color = "red";
    }
  }
}

function updateCurrentWordDisplay() {
  document.getElementById("currentWordDisplay").textContent = currentWord.split("").join(" ") || "_ _ _ _ _";
}

function resetWordGame() {
  currentWord = "";
  updateCurrentWordDisplay();
  document.getElementById("wordStatus").textContent = "";
  document.getElementById("wordStatus").style.color = "";
  showWordGame();
}

// --- Flappy Game ---
let flappyY = (300 - 30) / 2; // center vertically
let velocity = 2;
let gravity = 1.8;
let flapStrength = -8;
let flappyInterval;
let gameTime = 0;
let flappyAlive = true;

function showFlappyGame() {
  document.getElementById("wordGame").style.display = "none";
  document.getElementById("flappyGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("flappySound");
  sound.loop = true;
  sound.play();
  document.getElementById("flappyStatus").textContent = "";
  document.getElementById("flappyRestartButton").style.display = "inline-block";

  flappyY = (300 - 30) / 2;
  velocity = 2;
  gameTime = 0;
  flappyAlive = true;

  const Egg = document.getElementById("flappyEgg");
  Egg.textContent = "🥚"; // Reset to egg emoji
  document.getElementById("flappyRestartButton").style.display = "none";
  Egg.style.top = flappyY + "px";

  flappyInterval = setInterval(updateFlappy, 20);
  document.addEventListener("keydown", flapKey);
  document.addEventListener("click", flapClick);
}

function flapKey(e) {
  if (e.code === "Space") {
    velocity = flapStrength;
  }
}

function flapClick() {
  velocity = flapStrength;
}

function updateFlappy() {
  if (!flappyAlive) return;

  velocity += gravity;
  flappyY += velocity;

  const Egg = document.getElementById("flappyEgg");
  Egg.style.top = flappyY + "px";

  // Lose if you hit top/bottom
  if (flappyY < 0 || flappyY > 270) {
    endFlappy(false);
    return;
  }

  gameTime += 20;
  if (gameTime >= 15000) {
    endFlappy(true);
  }
}

function endFlappy(won) {
  clearInterval(flappyInterval);
  document.removeEventListener("keydown", flapKey);
  document.removeEventListener("click", flapClick);
  flappyAlive = false;

  const restartBtn = document.getElementById("flappyRestartButton");
  const Egg = document.getElementById("flappyEgg");

  if (won) {
    document.getElementById("flappyStatus").textContent = "🎉 Das Küken lebt! Und nachher retten wir auch noch den Schnaps vorm verdampfen!";
    document.getElementById("flappyStatus").style.color = "green";
    restartBtn.style.display = "none";
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  } else {
    document.getElementById("flappyStatus").textContent = "💀 Oh man, jetzt isch's hee!";
    document.getElementById("flappyStatus").style.color = "red";
    restartBtn.style.display = "inline-block";

    // Change egg to fried egg
    Egg.textContent = "🍳";
    restartBtn.style.display = "unset";
  }
}

function restartFlappyGame() {
  clearInterval(flappyInterval);
  document.removeEventListener("keydown", flapKey);
  document.removeEventListener("click", flapClick);
  showFlappyGame();
}

// --- Weight Guessing Game ---
const actualWeight = 156; // Example: the real weight in kg
const margin = 5; // Allowed range
let attempts = 0;

function showWeightGame() {
  document.getElementById("flappyGame").style.display = "none";
  document.getElementById("weightGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("weightSound");
  sound.loop = true;
  sound.play();
  document.getElementById("weightHint").textContent = "";
  document.getElementById("weightInput").value = "";
  attempts = 0;
}

function submitWeightGuess() {
  const input = document.getElementById("weightInput");
  const guess = parseFloat(input.value);
  const hint = document.getElementById("weightHint");

  if (isNaN(guess)) {
    hint.textContent = "❗ Schätz mal";
    hint.style.color = "orange";
    hint.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  attempts++;

  if (Math.abs(guess - actualWeight) <= margin) {
    hint.textContent = `🎉 Gutes Augenmaß, es sind ${actualWeight}kg.`;
    hint.style.color = "green";
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  } else if (guess < actualWeight) {
    hint.textContent = "🔼 Sammal siehst du richtig? Es ist MEHR!";
    hint.style.color = "red";
  } else {
    hint.textContent = "🔽 Sammal siehst du richtig? Es ist WENIGER!";
    hint.style.color = "red";
  }

  // Scroll to hint after processing
  hint.scrollIntoView({ behavior: "smooth", block: "center" });
}

// --- Circle Drawing Game ---
let isDrawing = false;
let points = [];

function showCircleGame() {
  document.getElementById("weightGame").style.display = "none";
  document.getElementById("circleGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("circleSound");
  sound.loop = true;
  sound.play();
  document.getElementById("circleStatus").textContent = "";
  points = [];

  const canvas = document.getElementById("circleCanvas");
  const ctx = canvas.getContext("2d");

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  canvas.onmousedown = startDraw;
  canvas.onmousemove = draw;
  canvas.onmouseup = endDraw;
  canvas.onmouseleave = endDraw;

  // Touch support
  canvas.ontouchstart = (e) => startDraw(e.touches[0]);
  canvas.ontouchmove = (e) => {
    draw(e.touches[0]);
    e.preventDefault();
  };
  canvas.ontouchend = endDraw;

  function startDraw(e) {
    isDrawing = true;
    points = [];
    ctx.beginPath();
    const x = e.offsetX || e.clientX - canvas.getBoundingClientRect().left;
    const y = e.offsetY || e.clientY - canvas.getBoundingClientRect().top;
    ctx.moveTo(x, y);
    points.push({ x, y });
  }

  function draw(e) {
    if (!isDrawing) return;
    const x = e.offsetX || e.clientX - canvas.getBoundingClientRect().left;
    const y = e.offsetY || e.clientY - canvas.getBoundingClientRect().top;
    ctx.lineTo(x, y);
    ctx.stroke();
    points.push({ x, y });
  }

  function endDraw() {
    if (isDrawing) {
      isDrawing = false;
      ctx.closePath();
    }
  }
}

function checkCircle() {
  if (points.length < 10) {
    document.getElementById("circleStatus").textContent = "❗ Zeichne den (92%ig-) perfekten Kreis";
    document.getElementById("circleStatus").style.color = "orange";
    return;
  }

  const canvas = document.getElementById("circleCanvas");
  const ctx = canvas.getContext("2d");

  // Calculate center
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Calculate distances from center
  const distances = points.map((p) => Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2));
  const avg = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const variance = distances.reduce((sum, d) => sum + (d - avg) ** 2, 0) / distances.length;
  const stddev = Math.sqrt(variance);
  const roundness = Math.max(0, 100 - (stddev / avg) * 100); // 100 = perfect circle

  const status = document.getElementById("circleStatus");

  if (roundness >= 92) {
    status.textContent = `🎉 Noice, dein Kreis ist ${roundness.toFixed(1)}% rund!`;
    status.style.color = "green";
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  } else {
    status.textContent = `😬 Nur ${roundness.toFixed(1)}% rund. Streng dich an!`;
    status.style.color = "red";

    // Reset canvas and points
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    points = [];
  }
}

// --- Rock Paper Scissors Game ---
let rpsPlayerScore = 0;
let rpsCpuScore = 0;

function showRPSGame() {
  document.getElementById("circleGame").style.display = "none";
  document.getElementById("rpsGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("buttonSound");
  sound.loop = true;
  sound.play();
  document.getElementById("rpsStatus").textContent = "Choose your move.";
  document.getElementById("rpsScore").textContent = "You: 0 | CPU: 0";
  rpsPlayerScore = 0;
  rpsCpuScore = 0;
}

function playRPS(playerChoice) {
  const choices = ["stein", "papier", "schere"];
  const cpuChoice = choices[Math.floor(Math.random() * 3)];

  let result = "";
  if (playerChoice === cpuChoice) {
    result = "🤝 Bei das gleiche!";
  } else if ((playerChoice === "stein" && cpuChoice === "schere") || (playerChoice === "papier" && cpuChoice === "stein") || (playerChoice === "schere" && cpuChoice === "papier")) {
    rpsPlayerScore++;
    result = `✅! ${playerChoice} schlägt ${cpuChoice}.`;
  } else {
    rpsCpuScore++;
    result = `❌! ${cpuChoice} schlägt ${playerChoice}.`;
  }

  document.getElementById("rpsStatus").textContent = result;
  document.getElementById("rpsScore").textContent = `Zischenstand - ${rpsPlayerScore} | ${rpsCpuScore}`;

  const retryBtn = document.createElement("button");
  retryBtn.id = "rpsRetryBtn";
  retryBtn.textContent = "🔁 Und nochmal";
  retryBtn.onclick = retryRPSGame;
  retryBtn.style.marginTop = "10px";
  document.getElementById("rpsGame").appendChild(retryBtn);
  retryBtn.style.display = "none";

  if (rpsPlayerScore === 3 || rpsCpuScore === 3) {
    if (rpsPlayerScore > rpsCpuScore) {
      document.getElementById("rpsStatus").textContent = "🎉🎉🎉🎉🎉 Spiel gewonnen! 🎉🎉🎉🎉🎉";
      sound.pause();
      sound.pause();
      sound = document.getElementById("yeahSound");
      sound.loop = false;
      sound.play();
      retryBtn.style.display = "none";
      nextGame(5000);
    } else {
      document.getElementById("rpsStatus").textContent = "💀 Besiegt vom Unglück, Mach nochmal!.";
      retryBtn.style.display = "unset";
    }
    // Disable buttons
    const buttons = document.querySelectorAll("#rpsGame button");
    buttons.forEach((btn) => {
      btn.disabled = btn !== retryBtn;
    });
  }
}

function retryRPSGame() {
  document.getElementById("circleGame").style.display = "none";
  document.getElementById("rpsGame").style.display = "block";
  document.getElementById("rpsStatus").textContent = "Choose your move.";
  document.getElementById("rpsScore").textContent = "You: 0 | CPU: 0";
  rpsPlayerScore = 0;
  rpsCpuScore = 0;
  // Enable buttons
  const buttons = document.querySelectorAll("#rpsGame button");
  buttons.forEach((btn) => (btn.disabled = false));
}

// --- Number Sorting Game ---
let puzzleSortable = null;

function showPuzzleGame() {
  document.getElementById("rpsGame").style.display = "none";
  document.getElementById("puzzleGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("wordSound");
  sound.loop = true;
  sound.play();
  document.getElementById("puzzleStatus").textContent = "";

  const list = document.getElementById("puzzleList");
  list.innerHTML = "";

  const numbers = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  numbers.forEach((num) => {
    const li = document.createElement("li");
    li.classList.add("no-select");
    switch (num) {
      case 1:
        li.textContent = "2-1";
        li.dataset.value = "1";
        break;
      case 2:
        li.textContent = "16÷8";
        li.dataset.value = "2";
        break;
      case 3:
        li.textContent = "3x1";
        li.dataset.value = "3";
        break;
      case 4:
        li.textContent = "2+6-4";
        li.dataset.value = "4";
        break;
      case 5:
        li.textContent = "1+2x2";
        li.dataset.value = "5";
        break;
    }
    list.appendChild(li);
  });

  // Only initialize Sortable once
  if (!puzzleSortable) {
    puzzleSortable = Sortable.create(list, {
      animation: 150,
      onEnd: checkPuzzle,
    });
  }
}

function checkPuzzle() {
  const listItems = document.querySelectorAll("#puzzleList li");
  const values = Array.from(listItems).map((li) => parseInt(li.dataset.value));

  const isCorrect = values.every((val, i) => val === i + 1);
  const status = document.getElementById("puzzleStatus");

  if (isCorrect) {
    status.textContent = "🎉 Geile(r) Sortierer*innen 🥵😏!";
    status.style.color = "green";
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  } else {
    status.textContent = "";
  }
}

// Star Rating Game
const starContainer = document.getElementById("starContainer");
const starMessage = document.getElementById("starMessage");

function showStarRatingGame() {
  document.getElementById("defuseGame").style.display = "none";
  document.getElementById("starGame").style.display = "block";
  for (let i = 1; i <= 5; i++) {
    const star = document.createElement("span");
    star.textContent = "☆";
    star.style.fontSize = "40px";
    star.style.cursor = "pointer";
    star.style.margin = "5px";
    star.dataset.index = i;
    star.addEventListener("click", () => handleStarClick(i));
    starContainer.appendChild(star);
  }
}

function handleStarClick(index) {
  const stars = starContainer.querySelectorAll("span");
  stars.forEach((star, i) => {
    star.textContent = i < index ? "★" : "☆";
  });

  if (index === 5) {
    starMessage.textContent = "🎉 Danke für die gute Bewertung! 😏";
    starMessage.style.color = "green";
    sound.pause();
    sound = document.getElementById("yeahSound");
    sound.loop = false;
    sound.play();
    nextGame(5000);
  } else {
    starMessage.textContent = "😢 WAS?!! MACH MAL VERNÜNFTIG! 😤😤";
    starMessage.style.color = "red";
  }
}

function showEndGame() {
  document.getElementById("starGame").style.display = "none";
  document.getElementById("endGame").style.display = "block";
  sound.pause();
  sound = document.getElementById("finishSound");
  sound.play();
}

function showArcheryGame() {
  document.getElementById("puzzleGame").style.display = "none";
  document.getElementById("archeryGame").style.display = "block";
  document.getElementById("arrowHeight").value = "";
  document.getElementById("arrowStrength").value = "";
  document.getElementById("arrowResult").textContent = "";
}

const correctHeight = 37; // target angle
const correctStrength = 74; // target power
const tolerance = 5;

function shootArrow() {
  const height = parseFloat(document.getElementById("arrowHeight").value);
  const strength = parseFloat(document.getElementById("arrowStrength").value);
  const result = document.getElementById("arrowResult");
  const arrow = document.getElementById("arrowEmoji");

  sound.pause();
  sound = document.getElementById("arrowSound");
  sound.play();

  if (isNaN(height) || isNaN(strength)) {
    result.textContent = "❗ Geb Winkel und Stärke ein!";
    result.style.color = "orange";
    return;
  }

  // Reset visuals
  arrow.style.left = "0px";
  arrow.style.top = "40px";
  arrow.textContent = "🏹";
  result.textContent = "";

  const heightDiff = Math.abs(height - correctHeight);
  const strengthDiff = Math.abs(strength - correctStrength);
  const isHit = heightDiff <= tolerance && strengthDiff <= tolerance;

  const maxPos = 350;
  let actualPos;

  if (isHit) {
    actualPos = maxPos;
  } else {
    // Reduce travel distance based on how far off the guess is
    const errorScore = Math.max(heightDiff, strengthDiff);
    const errorRatio = Math.min(errorScore / 50, 1); // cap at 1
    actualPos = maxPos * (1 - errorRatio * 0.6); // reduce up to 60%
  }

  let pos = 0;
  const peakHeight = height * 1.5;

  const anim = setInterval(() => {
    if (pos >= actualPos) {
      clearInterval(anim);

      if (isHit) {
        arrow.textContent = "💥";
        result.textContent = "🎯 Bullseye! Willhelm Tell, bisch du's?!";
        result.style.color = "green";
        sound.pause();
        sound.pause();
        sound = document.getElementById("yeahSound");
        sound.loop = false;
        sound.play();
        nextGame(5000);
      } else {
        arrow.textContent = "💨";
        result.textContent = generateMissMessage(height, strength);
        result.style.color = "red";
      }

      return;
    }

    pos += 10;
    arrow.style.left = pos + "px";

    const arc = Math.sin((pos / maxPos) * Math.PI) * peakHeight;
    arrow.style.top = (40 - arc).toFixed(0) + "px";
  }, 20);
}

function generateMissMessage(height, strength) {
  let hint = "";

  if (strength < correctStrength - 2) hint += "So lahm, der hätte ja nichteinmal 'n Gummibärchen durchbohrt.";
  else if (strength > correctStrength + 2) hint += "Mach mal weniger Kraft du Möchtegern!";
  else if (height < correctHeight - 2) hint += "Wieso zielst du auf'n Boden?.";
  else if (height > correctHeight + 2) hint += "Puh der war zu hoch!";

  return `❌ DANEBEN! ${hint}`;
}

let correctColor;
let beepInterval;
let retryCountdownInterval;

function showDefuseGame() {
  document.getElementById("archeryGame").style.display = "none";
  document.getElementById("defuseGame").style.display = "block";

  const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
  const shuffledColors = colors.sort(() => 0.5 - Math.random());
  correctColor = shuffledColors[Math.floor(Math.random() * shuffledColors.length)];

  const container = document.getElementById("wireContainer");
  const status = document.getElementById("defuseStatus");
  const retryBtn = document.getElementById("retryButton");
  const countdownText = document.getElementById("retryCountdown");

  container.innerHTML = "";
  status.textContent = "";
  retryBtn.style.display = "none";
  countdownText.textContent = "";

  // Start beeping
  const beep = document.getElementById("beepSound");
  clearInterval(beepInterval);
  beepInterval = setInterval(() => {
    beep.currentTime = 0;
    beep.play();
  }, 1000);

  shuffledColors.forEach((color) => {
    const wire = document.createElement("div");
    wire.className = "wire";
    wire.style.backgroundColor = color;

    if (color === correctColor) {
      wire.style.height = "24px";
      wire.style.boxShadow = "0 0 6px rgba(255, 255, 255, 0.5)";
    }

    wire.onclick = () => {
      if (color === correctColor) {
        wire.textContent = "✔️";
        status.textContent = "✅ PHEEEEEWWWWWW!";
        status.style.color = "green";
        clearInterval(beepInterval);
        disableAllWires();
        nextGame(5000);
      } else {
        wire.textContent = "💥";
        status.textContent = `💣 AH FUCK! (${color}).`;
        status.style.color = "red";
        clearInterval(beepInterval);
        disableAllWires();
        startRetryCountdown();
      }
    };

    container.appendChild(wire);
  });

  function disableAllWires() {
    const wires = document.querySelectorAll(".wire");
    wires.forEach((wire) => (wire.onclick = null));
  }
}

function startRetryCountdown() {
  const retryBtn = document.getElementById("retryButton");
  const countdownText = document.getElementById("retryCountdown");
  let countdown = 5;
  retryBtn.style.display = "none";
  countdownText.textContent = `⏳ Neuer Versuch in ${countdown}`;

  clearInterval(retryCountdownInterval);
  retryCountdownInterval = setInterval(() => {
    countdown--;
    if (countdown <= 0) {
      clearInterval(retryCountdownInterval);
      countdownText.textContent = "";
      retryBtn.style.display = "inline-block";
    } else {
      countdownText.textContent = `⏳ Neuer Versuch in ${countdown}`;
    }
  }, 1000);
}

function retryDefuseGame() {
  showDefuseGame();
}

function disableAllWires() {
  const wires = document.querySelectorAll(".wire");
  wires.forEach((wire) => {
    wire.onclick = null;
  });
}
