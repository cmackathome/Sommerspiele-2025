let counter = 0; // Game counter
let lastPressedButton = null; // Track which button was last pressed
let gameActive = false; // Flag to control the game state

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

// Start the game when "Start Game" button is pressed
function startGame() {
  // Hide the welcome modal and show the game
  document.getElementById("welcomeModal").style.display = "none";
  document.getElementById("game").style.display = "block";

  // Set the game state to active
  gameActive = true;
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
    document.getElementById("status").textContent =
      "Yay! Du hast die 69 geschafft!";
    document.getElementById("button1").disabled = true;
    document.getElementById("button2").disabled = true;

    setTimeout(showWordGame, 5000); // Delay before showing the next game
  }
}

// --- Word Puzzle Game Logic ---
const correctWord = "APEROL";
let currentWord = "";

function showWordGame() {
  document.getElementById("game").style.display = "none";
  document.getElementById("wordGame").style.display = "block";

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
      document.getElementById("wordStatus").textContent =
        "🎉 Gewonnen, was eine Saufnase!";
      document.getElementById("wordStatus").style.color = "green";
      setTimeout(showFlappyGame, 5000);
    } else {
      document.getElementById("wordStatus").textContent = "❌ Falsch! Sammal?";
      document.getElementById("wordStatus").style.color = "red";
    }
  }
}

function updateCurrentWordDisplay() {
  document.getElementById("currentWordDisplay").textContent =
    currentWord.split("").join(" ") || "_ _ _ _ _";
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
  document.getElementById("flappyStatus").textContent = "";
  document.getElementById("flappyRestartButton").style.display = "inline-block";

  flappyY = (300 - 30) / 2;
  velocity = 2;
  gameTime = 0;
  flappyAlive = true;

  const Egg = document.getElementById("flappyEgg");
  Egg.textContent = "🥚"; // Reset to egg emoji
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
    document.getElementById("flappyStatus").textContent =
      "🎉 Das Küken lebt! Und nachher retten wir auch noch den Schnaps vorm verdampfen!";
    document.getElementById("flappyStatus").style.color = "green";
    restartBtn.style.display = "none";

    setTimeout(showWeightGame, 5000);
  } else {
    document.getElementById("flappyStatus").textContent =
      "💀 Oh man, jetzt isch's hee!";
    document.getElementById("flappyStatus").style.color = "red";
    restartBtn.style.display = "inline-block";

    // Change egg to fried egg
    Egg.textContent = "🍳";
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
    setTimeout(showCircleGame, 5000);
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
    document.getElementById("circleStatus").textContent =
      "❗ Zeichne den (92%ig-) perfekten Kreis";
    document.getElementById("circleStatus").style.color = "orange";
    return;
  }

  const canvas = document.getElementById("circleCanvas");
  const ctx = canvas.getContext("2d");

  // Calculate center
  const centerX = points.reduce((sum, p) => sum + p.x, 0) / points.length;
  const centerY = points.reduce((sum, p) => sum + p.y, 0) / points.length;

  // Calculate distances from center
  const distances = points.map((p) =>
    Math.sqrt((p.x - centerX) ** 2 + (p.y - centerY) ** 2)
  );
  const avg = distances.reduce((sum, d) => sum + d, 0) / distances.length;
  const variance =
    distances.reduce((sum, d) => sum + (d - avg) ** 2, 0) / distances.length;
  const stddev = Math.sqrt(variance);
  const roundness = Math.max(0, 100 - (stddev / avg) * 100); // 100 = perfect circle

  const status = document.getElementById("circleStatus");

  if (roundness >= 92) {
    status.textContent = `🎉 Noice, dein Kreis ist ${roundness.toFixed(
      1
    )}% rund!`;
    status.style.color = "green";

    setTimeout(showRPSGame, 5000);
  } else {
    status.textContent = `😬 Nur ${roundness.toFixed(
      1
    )}% rund. Streng dich an!`;
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
  } else if (
    (playerChoice === "stein" && cpuChoice === "schere") ||
    (playerChoice === "papier" && cpuChoice === "stein") ||
    (playerChoice === "schere" && cpuChoice === "papier")
  ) {
    rpsPlayerScore++;
    result = `✅ Die Runde geht an dich, mach den Sack zu! ${playerChoice} schlägt ${cpuChoice}.`;
  } else {
    rpsCpuScore++;
    result = `❌ Der Zufall hat gewonnen, geb nicht auf! ${cpuChoice} schlägt ${playerChoice}.`;
  }

  document.getElementById("rpsStatus").textContent = result;
  document.getElementById(
    "rpsScore"
  ).textContent = `Gewonnene Runden (du brauchst 3) - Du: ${rpsPlayerScore} | Zufall: ${rpsCpuScore}`;

  if (rpsPlayerScore === 3 || rpsCpuScore === 3) {
    if (rpsPlayerScore > rpsCpuScore) {
      document.getElementById("rpsStatus").textContent = "🎉 War nur Zufall!";
      setTimeout(showPuzzleGame, 5000);
    } else {
      document.getElementById("rpsStatus").textContent =
        "💀 Besiegt vom Unglück, Mach nochmal!.";

      // Optionally: Add a retry button
      const retryBtn = document.createElement("button");
      retryBtn.id = "rpsRetryBtn";
      retryBtn.textContent = "🔁 Und nochmal";
      retryBtn.onclick = retryRPSGame;
      retryBtn.style.marginTop = "10px";
      document.getElementById("rpsGame").appendChild(retryBtn);
    }

    // Disable buttons
    const buttons = document.querySelectorAll("#rpsGame button");
    buttons.forEach((btn) => (btn.disabled = true));
    document.getElementById("rpsRetryBtn").disabled = false;
  }
}

function retryRPSGame() {
  document.getElementById("circleGame").style.display = "none";
  document.getElementById("rpsGame").style.display = "block";
  document.getElementById("rpsStatus").textContent = "Choose your move.";
  document.getElementById("rpsScore").textContent = "You: 0 | CPU: 0";
  document
    .getElementById("rpsGame")
    .removeChild(document.getElementById("rpsRetryBtn"));
  rpsPlayerScore = 0;
  rpsCpuScore = 0;
  // Enable buttons
  const buttons = document.querySelectorAll("#rpsGame button");
  buttons.forEach((btn) => (btn.disabled = false));
}

// --- Number Sorting Game ---
function showPuzzleGame() {
  document.getElementById("rpsGame").style.display = "none";
  document.getElementById("puzzleGame").style.display = "block";
  document.getElementById("puzzleStatus").textContent = "";

  const list = document.getElementById("puzzleList");
  list.innerHTML = "";

  const numbers = [1, 2, 3, 4, 5].sort(() => Math.random() - 0.5);
  numbers.forEach((num) => {
    const li = document.createElement("li");
    switch (num) {
      case 1:
        li.textContent = "2-1";
        li.title = 1;
        break;
      case 2:
        li.textContent = "16÷8";
        li.title = 2;
        break;
      case 3:
        li.textContent = "3x1";
        li.title = 3;
        break;
      case 4:
        li.textContent = "2+6-4";
        li.title = 4;
        break;
      case 5:
        li.textContent = "1+2x2";
        li.title = 5;
        break;
      default:
        li.textContent = num;
        break;
    }
    li.draggable = true;

    li.addEventListener("dragstart", dragStart);
    li.addEventListener("dragover", dragOver);
    li.addEventListener("drop", drop);
    li.addEventListener("dragenter", (e) => e.preventDefault());

    list.appendChild(li);
  });
}

let dragSrc = null;

function dragStart(e) {
  dragSrc = this;
  e.dataTransfer.effectAllowed = "move";
}

function dragOver(e) {
  e.preventDefault();
}

function drop() {
  if (dragSrc === this) return;

  const tcsrcText = dragSrc.textContent;
  const tctargetText = this.textContent;

  dragSrc.textContent = tctargetText;
  this.textContent = tcsrcText;

  const srcText = dragSrc.title;
  const targetText = this.title;

  dragSrc.title = targetText;
  this.title = srcText;

  checkPuzzle();
}

function checkPuzzle() {
  const listItems = document.querySelectorAll("#puzzleList li");
  const values = Array.from(listItems).map((li) => parseInt(li.title));

  const isCorrect = values.every((val, i) => val === i + 1);
  const status = document.getElementById("puzzleStatus");

  if (isCorrect) {
    status.textContent = "🎉 Geile(r) Sortierer*innen 🥵😏!";
    status.style.color = "green";

    setTimeout(showStarRatingGame, 5000);
  } else {
    status.textContent = "";
  }
}

// Star Rating Game
const starContainer = document.getElementById("starContainer");
const starMessage = document.getElementById("starMessage");

function showStarRatingGame() {
  document.getElementById("puzzleGame").style.display = "none";
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

    setTimeout(showEndGame, 5000);
  } else {
    starMessage.textContent = "😢 WAS?!! MACH MAL VERNÜNFTIG! 😤😤";
    starMessage.style.color = "red";
  }
}

function showEndGame() {
  document.getElementById("starGame").style.display = "none";
  document.getElementById("endGame").style.display = "block";
}
