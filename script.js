// Dots
const d1 = document.getElementById("d1");
const d2 = document.getElementById("d2");
const d3 = document.getElementById("d3");

const d4 = document.getElementById("d4");
const d5 = document.getElementById("d5");
const d6 = document.getElementById("d6");

const d7 = document.getElementById("d7");
const d8 = document.getElementById("d8");
const d9 = document.getElementById("d9");

// Red coins
const r1 = document.getElementById("r1");
const r2 = document.getElementById("r2");
const r3 = document.getElementById("r3");

// Blue coins
const b1 = document.getElementById("b1");
const b2 = document.getElementById("b2");
const b3 = document.getElementById("b3");

const status = document.getElementById("status");



const centers = {
    d1: { x: 7,   y: 7 },
    d2: { x: 150, y: 7 },
    d3: { x: 293, y: 7 },

    d4: { x: 7,   y: 150 },
    d5: { x: 150, y: 150 },
    d6: { x: 293, y: 150 },

    d7: { x: 7,   y: 293 },
    d8: { x: 150, y: 293 },
    d9: { x: 293, y: 293 }
};


// Red coins
r1.style.left = centers.d1.x + "px";
r1.style.top  = centers.d1.y + "px";

r2.style.left = centers.d2.x + "px";
r2.style.top  = centers.d2.y + "px";

r3.style.left = centers.d3.x + "px";
r3.style.top  = centers.d3.y + "px";

// Blue coins
b1.style.left = centers.d7.x + "px";
b1.style.top  = centers.d7.y + "px";

b2.style.left = centers.d8.x + "px";
b2.style.top  = centers.d8.y + "px";

b3.style.left = centers.d9.x + "px";
b3.style.top  = centers.d9.y + "px";



//logic

let currentTurn = "red"; // red starts
updateTurnDisplay();


// track where each coin is
const coinPositions = {
  r1: "d1",
  r2: "d2",
  r3: "d3",
  b1: "d7",
  b2: "d8",
  b3: "d9"
};

const adjacency = {
  d1:["d2","d4","d5"],
  d2:["d1","d3","d5"],
  d3:["d2","d6","d5"],
  d4:["d1","d7","d5"],
  d5:["d1","d2","d3","d4","d6","d7","d8","d9"],
  d6:["d3","d9","d5"],
  d7:["d4","d8","d5"],
  d8:["d7","d9","d5"],
  d9:["d6","d8","d5"]
};

const winningLines = [
  ["d2","d5","d8"], // middle vertical
  ["d4","d5","d6"], // middle horizontal
  ["d1","d5","d9"], // main diagonal
  ["d3","d5","d7"]  // anti diagonal
];

const winningLineMap = {
  // middle vertical
  "d2,d5,d8": [".v-line.v3",".v-line.v4"],

  // middle horizontal
  "d4,d5,d6": [".h-line.h3", ".h-line.h4"],

  // diagonals (two segments each)
  "d1,d5,d9": [".diag.d1-d5", ".diag.d9-d5"],
  "d3,d5,d7": [".diag.d3-d5", ".diag.d7-d5"]
};


let selectedCoin = null; 
document.querySelectorAll(".coin_red, .coin_blue").forEach(coin => {
  coin.addEventListener("click", () => {

    if (
      (currentTurn === "red"  && !coin.classList.contains("coin_red")) ||
      (currentTurn === "blue" && !coin.classList.contains("coin_blue"))
    ) return;

    if (selectedCoin) selectedCoin.classList.remove("selected");

    selectedCoin = coin;
    coin.classList.add("selected");
  });
});


document.querySelectorAll(".dot").forEach(dot => {
  dot.addEventListener("click", () => {
    if (!selectedCoin) return;

    const coinId = selectedCoin.id;
    const from = coinPositions[coinId];
    const to = dot.id;

    // only adjacent moves
    if (!adjacency[from].includes(to)) return;

    // move coin
    selectedCoin.style.left = centers[to].x + "px";
    selectedCoin.style.top  = centers[to].y + "px";
    coinPositions[coinId] = to;

    selectedCoin.classList.remove("selected");
    selectedCoin = null;

    checkWinAndSwitchTurn();
  });
});


function checkWin(playerColor) {
  const dots = Object.entries(coinPositions)
    .filter(([id]) =>
      playerColor === "red" ? id.startsWith("r") : id.startsWith("b")
    )
    .map(([,pos]) => pos);

  for (const line of winningLines) {
    if (line.every(d => dots.includes(d))) {
      return line; // return the winning line
    }
  }

  return null;
}


function checkWinAndSwitchTurn() {
  const winningLine = checkWin(currentTurn);

  if (winningLine) {

    // 1️⃣ Highlight line & coins immediately
    highlightWinningLine(winningLine, currentTurn);

    // 2️⃣ Fade board immediately
    document.querySelector(".board").classList.add("fade");

    // 3️⃣ Disable game immediately
    disableGame();

    // 4️⃣ Show WIN text AFTER a short delay
  setTimeout(() => {
  status.textContent = currentTurn.toUpperCase() + " WINS";
  status.className = `win ${currentTurn}`;
  // ⏱️ show restart button after win text
  setTimeout(() => {
    document.getElementById("restart-btn").style.display = "block";
    }, 600);   // delay AFTER win text
   }, 800);     // delay BEFORE win text
   // ⏱️ delay in milliseconds (800ms = 0.8s)

    return;
  }

  // normal turn switch
  currentTurn = currentTurn === "red" ? "blue" : "red";
  updateTurnDisplay();
}




function disableGame() {
  document.querySelectorAll(".coin_red, .coin_blue").forEach(c => {
    c.style.pointerEvents = "none";
  });

  document.querySelectorAll(".dot").forEach(d => {
    d.style.pointerEvents = "none";
  });
}

function updateTurnDisplay() {
  status.textContent = currentTurn.toUpperCase() + "'S TURN";
  status.className = currentTurn; // "red" or "blue"
}

function highlightWinningLine(line, playerColor) {
  const key = line.join(",");

  // 1️⃣ highlight dots
  line.forEach(dotId => {
    document.getElementById(dotId).classList.add("win");
  });

  // 2️⃣ highlight coins on that line
  Object.entries(coinPositions).forEach(([coinId, dotId]) => {
    if (line.includes(dotId)) {
      document.getElementById(coinId).classList.add("win");
    }
  });

  // 3️⃣ highlight the actual winning line(s)
  if (winningLineMap[key]) {
    winningLineMap[key].forEach(selector => {
      document.querySelector(selector).classList.add("win");
    });
  }
}


document.getElementById("restart-btn").addEventListener("click", () => {
  location.reload();
});

