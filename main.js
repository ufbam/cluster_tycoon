/*****************************************************
 * AI Compute Cluster Tycoon - Main Game Loop
 *****************************************************/

// --- Initialize Global State from localStorage or defaults ---
let gameState = {
  budget: Number(localStorage.getItem("budget")) || 5000,
  powerUsage: Number(localStorage.getItem("powerUsage")) || 10,      // MW
  computePower: Number(localStorage.getItem("computePower")) || 50,    // arbitrary units
  aiLevel: Number(localStorage.getItem("aiLevel")) || 0,          // 0 to 10
  gameTime: Number(localStorage.getItem("gameTime")) || 0,
  factoryStage: Number(localStorage.getItem("factoryStage")) || 0
};

// --- CANVAS SETUP ---
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const WIDTH = canvas.width;
const HEIGHT = canvas.height;

// --- IMAGE ASSETS ---
const assets = {
  desert_bg: new Image(),
  server_basic: new Image(),
  server_midtier: new Image(),
  server_hightier: new Image(),
  storage_unit: new Image(),
  cooling_unit: new Image(),
  factory_expansion: new Image()
};

assets.desert_bg.src = "assets/desert_bg.png";
assets.server_basic.src = "assets/server_basic.png";
assets.server_midtier.src = "assets/server_midtier.png";
assets.server_hightier.src = "assets/server_hightier.png";
assets.storage_unit.src = "assets/storage_unit.png";
assets.cooling_unit.src = "assets/cooling_unit.png";
assets.factory_expansion.src = "assets/factory_expansion.png";

// Example building positions on the map
let buildingPositions = [
  { x: 150, y: 250, type: "server_basic" },
  { x: 250, y: 240, type: "server_midtier" },
  { x: 350, y: 230, type: "server_hightier" },
  { x: 450, y: 270, type: "storage_unit" },
  { x: 550, y: 260, type: "cooling_unit" }
];

// List for factory expansions
let expansions = []; 

// --- GAME LOOP ---
function gameLoop() {
  update();
  draw();
  localStorage.setItem("budget", gameState.budget);
  localStorage.setItem("powerUsage", gameState.powerUsage);
  localStorage.setItem("computePower", gameState.computePower);
  localStorage.setItem("aiLevel", gameState.aiLevel);
  localStorage.setItem("gameTime", gameState.gameTime);
  localStorage.setItem("factoryStage", gameState.factoryStage);

  requestAnimationFrame(gameLoop);
}

// --- UPDATE GAME STATE ---
function update() {
  gameState.gameTime++;

  // Earn money and compute power over time (simulate renting server time)
  if (gameState.gameTime % 60 === 0) { // roughly every second
    gameState.budget += 50;
    gameState.computePower += 1;
    gameState.powerUsage += 0.1;
  }

  // AI development logic (after a threshold, AI begins to grow)
  if (gameState.computePower > 100 && gameState.aiLevel < 10) {
    gameState.aiLevel += 0.01;
  }

  // Example: factory expansion upgrade if budget is high
  if (gameState.factoryStage === 0 && gameState.budget > 10000) {
    expansions.push({ x: 650, y: 220, type: "factory_expansion" });
    gameState.factoryStage = 1;
  } else if (gameState.factoryStage === 1 && gameState.budget > 20000) {
    expansions.push({ x: 300, y: 180, type: "factory_expansion" });
    gameState.factoryStage = 2;
  }
}

// --- DRAW GAME ---
function draw() {
  // Draw desert background
  ctx.drawImage(assets.desert_bg, 0, 0, WIDTH, HEIGHT);

  // Draw factory expansions
  expansions.forEach(exp => {
    ctx.drawImage(assets.factory_expansion, exp.x, exp.y);
  });

  // Draw server/building sprites
  buildingPositions.forEach(building => {
    let img = assets[building.type];
    ctx.drawImage(img, building.x, building.y);
  });

  // Display game time on canvas
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Game Time: " + (gameState.gameTime / 60).toFixed(1) + "s", 10, 20);

  // Update dashboard elements
  document.getElementById("budgetValue").innerText = gameState.budget.toFixed(2);
  document.getElementById("powerValue").innerText = gameState.powerUsage.toFixed(2) + " MW";
  document.getElementById("computeValue").innerText = gameState.computePower.toFixed(2);
  document.getElementById("aiLevelValue").innerText = gameState.aiLevel.toFixed(2);
}

// --- START GAME LOOP ---
window.onload = () => {
  gameLoop();
};
