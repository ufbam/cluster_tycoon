/*****************************************************
 * AI Compute Cluster Tycoon
 * main.js
 *****************************************************/

// --- GLOBAL GAME STATE ---
let budget = 5000;
let powerUsage = 10;      // in MW
let computePower = 50;    // arbitrary compute units
let aiLevel = 0;          // from 0 (no AI) to 10 (sentient)
let gameTime = 0;         // track game progression
let gameRunning = true;

// --- UPGRADE STAGES ---
let factoryStage = 0;     // 0: small, 1: mid, 2: large expansions

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

// Load images
assets.desert_bg.src = "assets/desert_bg.png";
assets.server_basic.src = "assets/server_basic.png";
assets.server_midtier.src = "assets/server_midtier.png";
assets.server_hightier.src = "assets/server_hightier.png";
assets.storage_unit.src = "assets/storage_unit.png";
assets.cooling_unit.src = "assets/cooling_unit.png";
assets.factory_expansion.src = "assets/factory_expansion.png";

// Positions for various items on the map
let buildingPositions = [
  { x: 150, y: 250, type: "server_basic" },
  { x: 250, y: 240, type: "server_midtier" },
  { x: 350, y: 230, type: "server_hightier" },
  { x: 450, y: 270, type: "storage_unit" },
  { x: 550, y: 260, type: "cooling_unit" }
];

// Add or remove expansions
let expansions = []; // will hold { x, y, type: "factory_expansion" } if built

// --- MAIN LOOP ---
function gameLoop() {
  if (!gameRunning) return;

  update();
  draw();

  requestAnimationFrame(gameLoop);
}

// --- UPDATE FUNCTION ---
function update() {
  // Increase game time
  gameTime++;

  // Simple progression logic (you'll want to refine this)
  // Earn money from renting server time
  if (gameTime % 60 === 0) { 
    // Every ~1 second, earn some money
    budget += 50; 
    computePower += 1;
    powerUsage += 0.1;
  }

  // AI Development logic
  // Once computePower crosses 100, we start building AI
  if (computePower > 100 && aiLevel < 10) {
    aiLevel += 0.01; // slow AI growth
  }

  // If AI crosses certain threshold, random events could happen
  // (system failures, hacks, etc.)
  if (aiLevel >= 5) {
    // Example: if AI is halfway to sentient, it can cause small power surges
    if (Math.random() < 0.001) {
      powerUsage += 10; // sudden spike
      console.log("AI power surge!");
    }
  }

  // If AI is fully sentient
  if (aiLevel >= 10) {
    aiLevel = 10;
    console.log("The AI is sentient! Enable kill switch or risk takeover...");
    // Additional events or moral decisions can go here
  }

  // You could also add logic for building expansions
  if (factoryStage === 0 && budget > 10000) {
    // Upgrade to stage 1
    expansions.push({ x: 650, y: 220, type: "factory_expansion" });
    factoryStage = 1;
  } else if (factoryStage === 1 && budget > 20000) {
    // Upgrade to stage 2
    expansions.push({ x: 300, y: 180, type: "factory_expansion" });
    factoryStage = 2;
  }
}

// --- DRAW FUNCTION ---
function draw() {
  // Draw background
  ctx.drawImage(assets.desert_bg, 0, 0, WIDTH, HEIGHT);

  // Draw expansions
  expansions.forEach(exp => {
    ctx.drawImage(
      assets.factory_expansion,
      exp.x,
      exp.y
    );
  });

  // Draw buildings
  buildingPositions.forEach(building => {
    let img = assets[building.type];
    // Just a simple draw
    ctx.drawImage(img, building.x, building.y);
  });

  // Draw HUD text on the canvas (optional, or we can rely on DOM)
  ctx.fillStyle = "#fff";
  ctx.font = "16px Arial";
  ctx.fillText("Game Time: " + (gameTime / 60).toFixed(1) + "s", 10, 20);

  // Update DOM-based stats
  document.getElementById("budgetValue").innerText = budget.toFixed(2);
  document.getElementById("powerValue").innerText = powerUsage.toFixed(2) + " MW";
  document.getElementById("computeValue").innerText = computePower.toFixed(2);
  document.getElementById("aiLevelValue").innerText = aiLevel.toFixed(2);
}

// --- START THE GAME ---
window.onload = () => {
  gameLoop();
};
